import { useEffect, useRef } from "react";
import Notifier from '../utils/notifier'

// 通知配置类型定义
interface NotifierOptions {
    title?: string;
    body?: string;
    icon?: string;
    timeout?: number;
    interval?: number;
    audio?: string;
    volume?: number;
}

// 通知实例类型
interface NotifierInstance {
    notify: (options: NotifierOptions) => void;
    destroy: () => void;
}

export const useNotifier = (options: NotifierOptions = {}) => {
    const notifierRef = useRef<NotifierInstance | null>(null);

    useEffect(() => {
        // 创建新实例
        const notifier = new Notifier(options);

        // 挂载到 window
        if (typeof window !== 'undefined') {
            (window as any).$notify = notifier;
        }

        // 保存实例引用
        notifierRef.current = notifier;

        // 清理函数
        return () => {
            if (notifierRef.current) {
                notifierRef.current.destroy();
            }
            // 移除全局实例
            if (typeof window !== 'undefined') {
                delete (window as any).$notify;
            }
        };
    }, []); // 仅在组件挂载时创建实例

    // 返回通知方法
    return {
        notify: (notifyOptions: NotifierOptions) => {
            notifierRef.current?.notify(notifyOptions);
        },
        // 也可以返回实例，以便访问其他方法
        instance: notifierRef.current
    };
};
