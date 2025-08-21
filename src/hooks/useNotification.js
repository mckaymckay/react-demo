import { message } from "antd"
import { useEffect } from "react"
import iNotify from '../utils/createNotify'
import audioUrl from '../assets/audio.wav'

const PermissionsMap = {
    "granted": "已授权",
    "denied": '已拒绝',
    "prompt": "需要询问"

}
const sound = new Audio(audioUrl)

const isValidMicroPhone = async () => {
    const res = await navigator.permissions.query({ name: 'microphone' })
    if (res.state === 'granted') {
        console.log('granted microphone')
    } else if (res.state === 'prompt') {
        try {
            const resForAudio = await navigator.mediaDevices.getUserMedia({ audio: true })
            if (resForAudio) {
                console.log('允许麦克风权限')
            }
        }
        catch (error) {
            console.log(error)
            message.error('您拒绝了麦克风权限，请开启权限，并刷新页面')
        }

    }
}

export const useNotifier = () => {
    useEffect(() => {
        isValidMicroPhone()

        var iN = new iNotify({
            message: '有消息了。',
            effect: 'flash', // flash | scroll 闪烁还是滚动
            openurl: "http://www.bing.com", // 点击弹窗打开连接地址
            onclick: function () { //点击弹出的窗之行事件
                console.log("---")
                iN.close()
            },
            audio: {
                file: [audioUrl]
                //file: 'msg.mp4'
            },
            interval: 1000,//标题闪烁，或者滚动速度
            //可选chrome浏览器通知，默认不填写就是下面的内容
            notification: {
                title: " 您来了一条新消息",//设置标题
                icon: "",//设置图标 icon 默认为 Favicon
                body: '您来了一条新消息'//设置消息内容
            }
        })

        window.iN = iN
        window.sound = sound
    }, [])
}