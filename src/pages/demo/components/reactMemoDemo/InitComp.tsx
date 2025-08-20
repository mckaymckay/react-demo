import React, { useEffect } from 'react'

export default function InitComp(props) {
    useEffect(() => {
        console.log('我是InitComp，我重新渲染了')
    })
    return (
        <div>
            我是initComp，下边是父组件传给我的count:<span>{props.value}</span>
        </div>
    )
}
