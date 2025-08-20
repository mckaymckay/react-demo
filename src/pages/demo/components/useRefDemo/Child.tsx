import { Input } from 'antd'
import React, { useState } from 'react'

export default function Child(props) {
    const { name, ref } = props
    const [value, setValue] = useState('123')

    const handleInput = (e) => {
        setValue(e.target.value)
    }
    return (
        <div>
            Child name:{name}

            <input ref={ref} value={value} onChange={handleInput}></input>
        </div>
    )
}
