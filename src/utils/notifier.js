import audioUrl from '../../assets/audio.wav'
console.log(2, audioUrl)

class Notifier {
    constructor(options = {}) {
        this.options = {
            // 默认配置
            title: '新消息通知',           // 通知标题
            body: '',                       // 通知内容
            icon: '',      // 通知图标
            timeout: 5000,                  // 标题闪烁时间
            interval: 1000,                 // 闪烁间隔
            audio: '',                    // 音频文件
            volume: 1,                      // 音量
            ...options
        };

        // 存储原始标题
        this.originalTitle = document.title;
        // 音频实例
        this.audioContext = null;
        this.audioBuffer = null;
        // 标题闪烁定时器
        this.titleTimer = null;
        // 通知权限
        this.notificationPermission = false;

        // 初始化
        this.init();
    }

    // 初始化
    async init() {
        // 检查通知权限
        await this.checkNotificationPermission();
        // 初始化音频上下文
        this.initAudioContext();
        // 加载音频文件
        if (this.options.audio) {
            await this.loadAudio(this.options.audio);
        }
    }

    // 检查通知权限
    async checkNotificationPermission() {
        if (!('Notification' in window)) {
            console.warn('This browser does not support notifications');
            return;
        }

        if (Notification.permission === 'granted') {
            this.notificationPermission = true;
        } else if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            this.notificationPermission = permission === 'granted';
        }
    }

    // 初始化音频上下文
    initAudioContext() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
        } catch (error) {
            console.warn('Web Audio API is not supported in this browser');
        }
    }

    // 加载音频文件
    async loadAudio(audioUrl) {
        try {
            const response = await fetch(audioUrl);
            const arrayBuffer = await response.arrayBuffer();
            this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        } catch (error) {
            console.error('Error loading audio:', error);
        }
    }

    // 播放音频
    playAudio() {
        if (!this.audioContext || !this.audioBuffer) return;

        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();

        source.buffer = this.audioBuffer;
        gainNode.gain.value = this.options.volume;

        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        source.start(0);
    }

    // 标题闪烁
    flashTitle(message) {
        let isOriginal = true;
        const flash = () => {
            document.title = isOriginal ? this.originalTitle : message;
            isOriginal = !isOriginal;
        };

        // 清除现有定时器
        if (this.titleTimer) {
            clearInterval(this.titleTimer);
        }

        // 开始闪烁
        this.titleTimer = setInterval(flash, this.options.interval);

        // 设置超时后停止
        setTimeout(() => {
            if (this.titleTimer) {
                clearInterval(this.titleTimer);
                document.title = this.originalTitle;
            }
        }, this.options.timeout);
    }

    // 显示桌面通知
    showNotification(title, options = {}) {
        if (!this.notificationPermission) return;

        const notification = new Notification(title, {
            icon: this.options.icon,
            ...options
        });

        notification.onclick = () => {
            window.focus();
            notification.close();
        };

        // 自动关闭
        setTimeout(() => notification.close(), this.options.timeout);
    }

    // 通知
    notify(options = {}) {
        const config = { ...this.options, ...options };

        // 播放提示音
        this.playAudio();

        // 闪烁标题
        this.flashTitle(config.title);

        // 显示桌面通知
        this.showNotification(config.title, {
            body: config.body,
            icon: config.icon
        });
    }

    // 销毁实例
    destroy() {
        // 清除标题闪烁
        if (this.titleTimer) {
            clearInterval(this.titleTimer);
            document.title = this.originalTitle;
        }

        // 关闭音频上下文
        if (this.audioContext) {
            this.audioContext.close();
        }
    }
}

export default Notifier;
