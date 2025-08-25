import React, { useEffect } from 'react'
import loadBMapPromise from './loadBMap'
import LazyImage from './LazyImage'

export default function Index() {

    useEffect(() => {
        startBMap()
    }, [])

    const startBMap = async () => {
        // loadBMapPromise().then(() => {
        //     // 百度地图 API 已加载，可以安全使用 BMap 相关对象和方法
        //     // const map = new BMap.Map('container');
        //     console.log(12)
        //     // ...
        // });


    }
    return (
        <div>
            <h2>发布</h2>
            <LazyImage />

            <h3>处理接口</h3>
        </div>
    )
}
