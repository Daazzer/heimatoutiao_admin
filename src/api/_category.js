import axios from '@/utils/axios_http-config'

/** 获取栏目 */
const getCategory = () => axios.get('/category').then(res => [null, res]).catch(err => [err])

export default {
  getCategory
}
