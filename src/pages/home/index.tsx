import React from 'react'
import { useNavigate } from 'react-router-dom'
export default function Index() {
    const navigate = useNavigate();

    const handleClick = (path) => {
        navigate(path)
    }


    return (
        <div>
            <h1>这是首页</h1>

            <ul style={{ cursor: 'pointer' }}>
                <li onClick={() => handleClick('/demo')}>demo</li>
                <li onClick={() => handleClick('/chat')}>chat</li>
                <li onClick={() => handleClick('/fabu')}>fabu</li>
            </ul>

        </div>
    )
}
