import icon from '../assets/react.svg'

export const messageNotification = () => {
    window?.iN.setTitle('您有一条新消息').notify({
        title: '消息待处理',
        body: '新消息来啦',
        icon,
        openUrl: 'www.bing.com',
    })

    // window.sound.play()
    window.iN.player()
}