import React, { useRef } from 'react';
import Child from './Child'
import { Button } from 'antd'

const MyComponent = () => {
    const inputRef = useRef(null);
    const childRef = useRef(null);


    const handleChange = () => {
        // 改变 ref 的值
        inputRef.current.value = 'Hello, World!';
        console.log(inputRef.current.value); // 直接访问 DOM 元素

    };
    const handleChild = () => {
        console.log(childRef.current)
    }

    return (
        <div>
            <input ref={inputRef} type="text" />
            <button onClick={handleChange}>改变输入框内容</button>
            <Child ref={childRef} name='zhangsan' />
            <button onClick={handleChild}>拿到child的ref</button>
        </div>
    );
};

export default MyComponent;
