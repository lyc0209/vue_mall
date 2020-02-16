import axios from 'axios'

export function request(config) {
  //1. 创建axios实例
  const instance = axios.create({
    baseURL: 'http://106.54.54.237:8000/api/hy',
    timeout: 50000
  })

  instance.interceptors.request.use(config => {
    return config
  }, err => {
    // console.log(err);
  })

  //2.2. 响应拦截
  instance.interceptors.response.use(res => {
    //res.data是返回的结果
    return res.data
  }, err => {
    console.log(err);
  })

  //返回Promise
  return instance(config)
}
