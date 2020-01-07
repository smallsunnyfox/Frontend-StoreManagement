import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import storage from '@/utils/storage'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (storage.get('token')) {
      // 让每个请求携带令牌
      config.headers['TOKEN'] = storage.get('token')
    }
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    if (res.codeName && res.codeName === 'LOGIN-00001') {
      MessageBox.confirm('您已退出, 可以取消停留在当前页面,或者重新登录', '注销', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      }).catch(() => {

      })
      return Promise.reject(new Error('Not logined'))
    } else {
      return res
    }
  },
  error => {
    Message({
      message: '服务器开小差了QAQ',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
