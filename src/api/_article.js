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

/**
 * 发布文章
 * @param {Object} data 参数对象
 * @param {string} data.title 文章标题
 * @param {string} data.content 文章内容
 * @param {Array<Object>} data.categories 所属栏目ID集合
 * @param {Array<Object>} data.cover 封面图片ID集合
 * @param {number} data.type 1为文章，2为视频
 * @returns {Promise<Response>}
 */
const publishArticle = data => axios.post('/post', data).then(res => [null, res]).catch(err => [err])

const getArticleById = id => axios.get(`/post/${id}`).then(res => [null, res]).catch(err => [err])

/**
 * 编辑文章
 * @param {number} id 文章 id
 * @param {Object} data 参数
 * @param {string} data.title 文章标题
 * @param {string} data.content 文章内容
 * @param {Array<Object>} data.categories 所属栏目ID集合
 * @param {Array<Object>} data.cover 封面图片ID集合
 * @param {number} data.type 1为文章，2为视频
 * @param {number} data.open 1为打开，0为关闭
 * @returns {Promise<Response>}
 */
const editArticleById = (id, data) => axios.post(`/post_update/${id}`, data).then(res => [null, res]).catch(err => [err])

export default {
  getArticle,
  publishArticle,
  getArticleById,
  editArticleById
}
