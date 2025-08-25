import axios from 'axios'
import { message } from 'antd'
import qs from 'qs'

const instance = axios.create({
    baseURL: '/'
})

instance.interceptors.response.use(
    response => {
        if (response?.status === 302 || response?.status === 307) {
            window.location.href = 'www.baidu.com'
            return response.data
        }

        return response.data
    },
    error => {
        message.error('接口报错')
        return Promise.reject({ data: null })
    }
)

instance.interceptors.request.use(
    config => {
        return config
    },
    () => { }
)

const get = <T>(url: string, params?: any, config?: any): Promise<T> => {
    return instance.get(url, {
        params,
        ...config
    })
}

const post = <T>(url: string, data?: any, config?: any): Promise<T> => {
    return instance.post(url, data, {
        ...config
    })
}

const postByFormUrlencoded = <T>(url: string, data?: any, config?: any): Promise<T> => {
    return instance.post(url, qs.stringify(data), {
        ...config
    })
}

export { get, post, postByFormUrlencoded }