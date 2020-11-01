import axios from '@/utils/axios_http-config'

/**
 * 文章列表
 * @param {Object} [params] 参数对象
 * @param {number} [data.category] 栏目id
 * @param {number} [data.pageIndex] 当前页码
 * @param {number} [data.pageSize] 每页显示数据条数
 * @returns {Promise<Response>}
 */
const getArticle = params => axios.get('/post', { params }).then(res => [null, res]).catch(err => [err])

export default {
  getArticle
}
