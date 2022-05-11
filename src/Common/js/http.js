import fetch from '@system.fetch'
import rootStore from './rootStore.js'

// http://api.tianapi.com/txapi/zaoan/index?key=24d597138c99ebe0e5153d2705e37550
let BASE_URL = 'http://10.48.0.82:9010/api/v1' // 沙盒接口地址

if(process.env.NODE_ENV === 'production') {
  BASE_URL = "http://api.tianapi.com/txapi" // 线上接口地址
}

const request = (options = {}) => {
  const { url, data, header = {}, method = 'GET', responseType = 'json' } = options
  let abort = null
  const abortPromise = new Promise((resolve, reject) => { abort = reject })
  const reqPromise = new Promise((resolve, reject) => {
    if (!url) {
      reject(new Error('地址不存在。'))
      return
    }
    fetch.fetch({
      url,
      data,
      header,
      method,
      responseType,
      success(response) {
        resolve(response)
      },
      fail(error, code) {
        // prompt.showToast({
        //   message: error
        // })
        console.log(`\najax error(${code}) =`, error)
        reject(error, code)
      },
      complete(data) {
      }
    })
  })
  const promise = Promise.race([reqPromise, abortPromise])
  promise.abort = abort
  return promise
}

const http = {
  get: function (url, params, options = {}) {
    console.log('\n\n===> get ajax 请求参数: ', { ...rootStore.getGlbParams(), ...params});
    return request({ url: BASE_URL + url, data: { ...rootStore.getGlbParams(), ...params}, method: 'GET', ...options })
  },
  post: function (url, data, options = {}) {
    try {
      options.header = {
        "Content-Type": 'application/x-www-form-urlencoded'
      }
      return request({ url: BASE_URL + url, data, method: 'POST', ...options })
    } catch (e) {
      console.log(e)
    }
  },
  request
}

export default http
