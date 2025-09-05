// hooks/useSimpleRAF.js
import {
  useState, useEffect, useRef, useCallback,
} from 'react';

const useSimpleRAF = (items, batchSize = 10) => {
  const [renderedItems, setRenderedItems] = useState([]);
  const [isRendering, setIsRendering] = useState(false);
  const [progress, setProgress] = useState(0);

  const currentIndexRef = useRef(0);
  const rafIdRef = useRef(null);

  const renderNextBatch = useCallback(() => {
    const startIndex = currentIndexRef.current;
    const endIndex = Math.min(startIndex + batchSize, items.length);

    if (startIndex >= items.length) {
      setIsRendering(false);
      setProgress(100);
      return;
    }

    // 添加新的批次到已渲染项目中
    const newBatch = items.slice(startIndex, endIndex);
    console.log('newBatch', newBatch);
    setRenderedItems((prev) => [...prev, ...newBatch]);

    // 更新进度
    currentIndexRef.current = endIndex;
    const newProgress = (endIndex / items.length) * 100;
    setProgress(newProgress);

    // 继续下一批次
    if (endIndex < items.length) {
      // rafIdRef.current = requestAnimationFrame(renderNextBatch);
      setTimeout(() => {
        rafIdRef.current = requestAnimationFrame(renderNextBatch);
      }, 1500);
    } else {
      setIsRendering(false);
      setProgress(100);
    }
  }, [items, batchSize]);

  const startRendering = useCallback(() => {
    if (items.length === 0) return;

    // 重置状态
    setRenderedItems([]);
    setProgress(0);
    currentIndexRef.current = 0;
    setIsRendering(true);

    // 开始渲染
    rafIdRef.current = requestAnimationFrame(renderNextBatch);
  }, [items, renderNextBatch]);

  // 清理函数
  useEffect(() => () => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
  }, []);

  // 当 items 改变时自动开始渲染
  useEffect(() => {
    if (items.length > 0) {
      startRendering();
    }
  }, [items, startRendering]);

  return {
    renderedItems,
    isRendering,
    progress: Math.round(progress),
    startRendering,
  };
};

export default useSimpleRAF;
