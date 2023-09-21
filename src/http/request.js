import axios from 'axios'
// import store from '@/store'
// import storage from 'store'
// import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
// import { ACCESS_TOKEN } from '@/store/mutation-types'

// 创建 axios 实例
const request = axios.create({
    // API 请求的默认前缀
    baseURL: "/api",
    // baseURL: "https://jsonplaceholder.typicode.com",
    // baseURL: process.env.VUE_APP_API_BASE_URL,
    timeout: 6000, // 请求超时时间
    withCredentials: true
})

// 异常拦截处理器
const errorHandler = (error) => {
    console.log('errorHandler', error)
    if (error.response) {
        // const data = error.response.data
        // // 从 localstorage 获取 token
        // const token = storage.get(ACCESS_TOKEN)
        if (error.response.status === 403) {
            // notification.error({
            //   message: 'Forbidden',
            //   description: data.message
            // })
        }
        if (error.response.status === 500) {
            // notification.error({
            //   message: '500 (Internal Server Error)',
            //   description: data
            // })
        }
        // if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
        //   notification.error({
        //     message: 'Unauthorized',
        //     description: 'Authorization verification failed'
        //   })
        //   // 清除登录状态
        //   store.dispatch('Logout').then(() => {
        //     setTimeout(() => {
        //       window.location.reload()
        //     }, 1500)
        //   })
        // }
    }
    return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
    // const token = storage.get(ACCESS_TOKEN)

    // console.log('config', config)
    // console.log('token', token)
    // // 如果 token 存在
    // // 让每个请求携带自定义 token 请根据实际情况自行修改
    // if (token) {
    //   config.headers['Access-Token'] = token
    //   const params = config.params || {}
    //   params['token'] = token
    //   config.params = params
    // }

    console.log('config', config)

    return config
}, errorHandler)

// response interceptor
request.interceptors.response.use((response) => {
    // console.log('axios response', response)

    // 判断接口返回内容内的成功标志是否为真，待后端重构后确定，现在暂时为永真
    // if (true) {
    return Promise.resolve(response.data || response)
        // } else {
        //   // 错误信息返回到调用处进行弹出
        //   return Promise.reject(response.data)
        // }
}, errorHandler)

const installer = {
    vm: {},
    install(Vue) {
        Vue.use(VueAxios, request)
    }
}

export default request

export {
    installer as VueAxios,
    request as axios
}