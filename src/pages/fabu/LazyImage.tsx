import { Table, Image } from 'antd';
import * as React from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { getImageListApi } from '../../service/api'

// 懒加载图片组件
const LazyImage = ({ src, alt, width = 80, height = 80 }) => {
    const [loaded, setLoaded] = useState(false);
    const [inView, setInView] = useState(true);
    const imgRef = useRef(null);


    //  Intersection Observer 的回调函数
    const handleIntersectionObserver = useCallback((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setInView(true)
            }
        })
    }, [])

    useEffect(() => {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(handleIntersectionObserver, {
                threshold: 0.1
            })
            if (imgRef.current) observer.observe(imgRef.current)
            return () => observer.disconnect()
        } else {
            setInView(true)
        }
    }, [])


    return (
        <div ref={imgRef} style={{ width, height, backgroundColor: '#f5f5f5' }}>
            {inView && (
                <Image
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    placeholder={<div style={{ width, height, backgroundColor: '#f0f0f0' }} />}
                    onLoad={() => setLoaded(true)}
                    style={{ objectFit: 'cover' }}
                />
            )}
        </div>
    );
};


// 图片列渲染
const ImageColumn = ({ images, id }) => {
    return (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {images?.slice(0, 3).map((img, index) => (
                <div>
                    <LazyImage key={`${id}_${index}`} src={img} alt={`图片+${index}`} />
                </div>
            ))}
            <div></div>
            {images?.length > 3 && <span>+{images.length - 3}</span>}
        </div>
    );
};

// 主表格组件
const DataTable = () => {
    const [imageList, setImageList] = useState([])

    useEffect(() => {
        getImageList()
    }, [])

    const getImageList = async () => {
        const res = await getImageListApi()
        setImageList(res.data)
    }
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '图片',
            dataIndex: 'images',
            key: 'images',
            render: (text, record) => <ImageColumn images={text} id={record.id} />,
        },
        // 其他列...
    ];

    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = 'src/assets/img5.jpeg'
        document.head.appendChild(link);
    }, [])


    return (
        <div>
            <h2>懒加载图片+虚拟滚动</h2>

            <Table
                virtual
                dataSource={imageList}
                columns={columns}
                scroll={{ y: 400 }} // 启用虚拟滚动
                pagination={{ pageSize: 100 }} // 分页减少同时渲染的数据
            />
        </div>

    );
};
export default DataTable