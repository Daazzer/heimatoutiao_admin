import axios from '@/utils/axios_http-config'

/**
 * 登录
 * @param {Object} data 参数对象
 * @param {string} data.username 用户名 / 手机
 * @param {string} data.password 密码
 * @returns {Promise<Response>}
 */
const login = data => axios.post('/login', data).then(res => [null, res]).catch(err => [err])

export default {
  login
}
