import { get } from '../utils/request'
export const getTaskList = () => {
    return get('/api/fetchTaskList')
}

// 获取预加载图片列表
export const getImageListApi = () => {
    return get('./api/fetchImageList')
}

// 获取长表单config
export const getFormConfig = () => {
    return get('/api/fetchFormConfig')
}
// 获取长表单详情
export const getFormDetail = (params) => {
    return get('/api/fetchFormDetail', params)
}