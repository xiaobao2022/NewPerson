// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
import { getTimeStamp } from '@/utils/auth'
const TimeOut = 600000000000 // 定义超时时间 单位s
function IsCheckTimeOut() {
  return Date.now() - getTimeStamp() < TimeOut
}
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API
}) // 创建一个axios的实例

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在这个位置需要统一的去注入token
    if (store.getters.token) {
      // 如果token存在 注入token
      if (IsCheckTimeOut()) {
        config.headers['Authorization'] = `Bearer ${store.getters.token}`
      } else {
        Message.error('token过期,请重新登入')
        store.dispatch('user/logout') // 登出操作
        // 跳转到登录页
        router.push('/login')
        return Promise.reject(new Error('token超时了'))
      }
    }
    return config // 必须返回配置
  }, error => {
    return Promise.reject(error)
  }
)
// 响应拦截器
service.interceptors.response.use(
  response => {
    // console.log(response)
    const { data: { success, data, message }} = response
    if (success) {
      return data
    }
    Message.error(message || '系统错误')
    return Promise.reject(message || '系统错误')
  }, error => {
    console.log(error)
    if (error.response.status === 401) {
      store.dispatch('user/logout') // 登出操作
      // 跳转到登录页
      router.push('/login')
    }
    Message.error(error.response?.data?.message || '系统错误')
    return Promise.reject(error)
  }
)
export default service // 导出axios实例
