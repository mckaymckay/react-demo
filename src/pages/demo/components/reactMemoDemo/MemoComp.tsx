import React, { useEffect } from 'react'

const MemoComp = React.memo((props) => {
    useEffect(() => {
        console.log('我是MemoComp,我重新渲染了,props不变我不会渲染，即使父组件的state变化了')
    })
    return (
        <div>
            我是MemoComp，下边是父组件传给我的count2:<span>{props.value}</span>
        </div>
    )
})

export default MemoComp
