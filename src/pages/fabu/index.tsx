import React, { useEffect } from 'react'
import loadBMapPromise from './loadBMap'
import LazyImage from './LazyImage'
import PreloadConfig from './PreloadConfig'
import BeforeLeave from './BeforeLeave'

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
            <h2>发布房源页面</h2>

            <BeforeLeave />
            <PreloadConfig />
            <LazyImage />


        </div>
    )
}
