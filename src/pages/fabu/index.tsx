import React, { useEffect } from 'react';
import loadBMapPromise from './loadBMap';
import LazyImage from './LazyImage';
import PreloadImage from './PreLoadImage';
import PreloadConfig from './preloadForm';
import RAFPreloadConfig from './preloadForm/rafForm';
import BeforeLeave from './BeforeLeave';

export default function Index() {
  useEffect(() => {
    startBMap();
  }, []);

  const startBMap = async () => {
    // loadBMapPromise().then(() => {
    //     // 百度地图 API 已加载，可以安全使用 BMap 相关对象和方法
    //     // const map = new BMap.Map('container');
    //     console.log(12)
    //     // ...
    // });

  };
  return (
    <div>
      <h2>发布房源页面</h2>

      {/* 关闭页面前提醒保存 */}
      <BeforeLeave />

      {/* 懒加载+虚拟滚动渲染多图片表格 */}
      {/* <LazyImage /> */}
      {/* 可视区域检测+只能 */}
      {/* <PreloadImage />

      {/* 长表单渲染 */}
      {/* <PreloadConfig /> */}
      <RAFPreloadConfig />

    </div>
  );
}
