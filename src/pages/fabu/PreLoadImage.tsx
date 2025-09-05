import { Table, Image } from 'antd';
import * as React from 'react';
import {
  useState, useRef, useEffect, useCallback,
} from 'react';
import { getImageListApi } from '../../service/api';

// 预加载管理器
class ImagePreloadManager {
  constructor() {
    this.preloadedImages = new Set();
    this.preloadQueue = [];
    this.isProcessing = false;
  }

  // 预加载单个图片
  preloadImage(src) {
    if (this.preloadedImages.has(src)) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      link.onload = () => {
        this.preloadedImages.add(src);
        resolve();
      };
      link.onerror = reject;
      document.head.appendChild(link);
    });
  }

  // 批量预加载（空闲时）
  async batchPreload(imageUrls, priority = 'low') {
    if (this.isProcessing && priority === 'low') return;

    const newImages = imageUrls.filter((url) => !this.preloadedImages.has(url));
    if (newImages.length === 0) return;

    if (priority === 'high') {
      // 高优先级：立即预加载
      await Promise.allSettled(newImages.map((url) => this.preloadImage(url)));
    } else {
      // 低优先级：空闲时预加载
      this.addToQueue(newImages);
      this.processQueue();
    }
  }

  addToQueue(imageUrls) {
    this.preloadQueue.push(...imageUrls);
  }

  async processQueue() {
    if (this.isProcessing || this.preloadQueue.length === 0) return;

    this.isProcessing = true;

    const processInIdle = () => {
      if (this.preloadQueue.length === 0) {
        this.isProcessing = false;
        return;
      }

      const url = this.preloadQueue.shift();

      this.preloadImage(url).catch((err) => {
        console.warn('预加载失败:', url, err);
      }).finally(() => {
        // 使用 requestIdleCallback 或 setTimeout 来避免阻塞
        if ('requestIdleCallback' in window) {
          requestIdleCallback(processInIdle, { timeout: 1000 });
        } else {
          setTimeout(processInIdle, 50);
        }
      });
    };

    processInIdle();
  }
}

// 全局预加载管理器实例
const preloadManager = new ImagePreloadManager();

// 懒加载图片组件（增强版）
function LazyImage({
  src, alt, width = 80, height = 80, onVisible,
}) {
  const [inView, setInView] = useState(false);
  const imgRef = useRef(null);

  // Intersection Observer 的回调函数
  const handleIntersectionObserver = useCallback((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !inView) {
        setInView(true);
        // 通知父组件图片进入可视区域
        onVisible?.(src);
        // 立即预加载当前图片
        preloadManager.preloadImage(src);
      }
    });
  }, [src, inView, onVisible]);

  useEffect(() => {
    if ('IntersectionObserver' in window && imgRef.current) {
      const observer = new IntersectionObserver(handleIntersectionObserver, {
        rootMargin: '50px', // 提前50px开始加载
        threshold: 0.1,
      });

      observer.observe(imgRef.current);
      return () => observer.disconnect();
    }
    setInView(true);
    onVisible?.(src);
  }, [handleIntersectionObserver]);

  return (
    <div
      ref={imgRef}
      style={{
        width, height, backgroundColor: '#f5f5f5', position: 'relative',
      }}
    >
      {inView && (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          placeholder={false}
        />
      )}
    </div>
  );
}

// 图片列渲染（增强版）
function ImageColumn({ images, id, onImagesVisible }) {
  const visibleImages = images?.slice(0, 3) || [];

  const handleImageVisible = useCallback((src) => {
    onImagesVisible?.(visibleImages, images);
  }, [visibleImages, images, onImagesVisible]);

  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {visibleImages.map((img, index) => (
        <div key={`${id}_${index}`}>
          <LazyImage
            src={img}
            alt={`图片${index + 1}`}
            onVisible={handleImageVisible}
          />
        </div>
      ))}
      {images?.length > 3 && (
        <span style={{
          alignSelf: 'center',
          fontSize: '12px',
          color: '#666',
          marginLeft: '4px',
        }}
        >
          +
          {images.length - 3}
        </span>
      )}
    </div>
  );
}

// 主表格组件（增强版）
function DataTable() {
  const [imageList, setImageList] = useState([]);
  const [visibleRowImages, setVisibleRowImages] = useState(new Set());
  const preloadTimerRef = useRef(null);

  const getImageList = async () => {
    const res = await getImageListApi();
    setImageList(res.data);

    // 数据加载完成后，预处理所有图片URL
    const allImages = res.data.flatMap((item) => item.images || []);

    // 延迟预加载所有图片（低优先级）
    setTimeout(() => {
      preloadManager.batchPreload(allImages, 'low');
    }, 3000);
  };

  // 处理图片进入可视区域的回调
  const handleImagesVisible = useCallback((visibleImages, allImages) => {
    // 记录可视区域的图片
    const newVisibleImages = new Set([...visibleRowImages, ...visibleImages]);
    setVisibleRowImages(newVisibleImages);

    // 高优先级预加载当前可视区域的图片
    preloadManager.batchPreload(visibleImages, 'high');

    // 清除之前的定时器
    if (preloadTimerRef.current) {
      clearTimeout(preloadTimerRef.current);
    }

    // 延迟预加载该行的其他图片
    preloadTimerRef.current = setTimeout(() => {
      const remainingImages = allImages.filter((img) => !visibleImages.includes(img));
      preloadManager.batchPreload(remainingImages, 'low');
    }, 500);
  }, [visibleRowImages]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '图片',
      dataIndex: 'images',
      key: 'images',
      width: 300,
      render: (text, record) => (
        <ImageColumn
          images={text}
          id={record.id}
          onImagesVisible={handleImagesVisible}
        />
      ),
    },
  ];

  // 清理定时器
  useEffect(() => () => {
    if (preloadTimerRef.current) {
      clearTimeout(preloadTimerRef.current);
    }
  }, []);

  useEffect(() => {
    getImageList();
  }, []);
  return (
    <div>
      <h2>智能预加载图片表格</h2>
      <div style={{ marginBottom: '16px', fontSize: '12px', color: '#666' }}>
        已预加载图片:
        {' '}
        {preloadManager.preloadedImages.size}
        {' '}
        |
        可视区域图片:
        {visibleRowImages.size}
      </div>

      <Table
        // virtual
        dataSource={imageList}
        columns={columns}
        scroll={{ y: 400, x: 500 }} // 启用虚拟滚动
        pagination={false} // 虚拟滚动时建议关闭分页
        rowKey="id"
      />
    </div>
  );
}

export default DataTable;
