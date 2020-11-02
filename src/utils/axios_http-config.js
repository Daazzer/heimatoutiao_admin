import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3000'

axios.interceptors.request.use(config => {
  const token = JSON.parse(localStorage.getItem('heimatoutiao_admin_userInfo') || '{}').token
  if (token) {
    config.headers.Authorization = token
  }
  return config
}, error => {
  Promise.reject(error)
})

export default axios
