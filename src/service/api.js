import { get } from '../utils/request'
export const getTaskList = () => {
    return get('/api/fetchTaskList')
}