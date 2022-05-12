import fetch from '@system.fetch'
import rootStore from './rootStore.js'
import utils from './utils.js'

// http://api.tianapi.com/txapi/zaoan/index?key=24d597138c99ebe0e5153d2705e37550
let BASE_URL = 'http://10.48.0.82:9010/api/v1' // 沙盒接口地址

if(process.env.NODE_ENV === 'production') {
  BASE_URL = "http://api.tianapi.com/txapi" // 线上接口地址
}

const request = (options = {}) => {
  const { url, data, header = {}, params, method = 'GET', responseType = 'json' } = options
  let abort = null
  const abortPromise = new Promise((resolve, reject) => { abort = reject })
  const reqPromise = new Promise((resolve, reject) => {
    if (!url) {
      reject(new Error('地址不存在。'))
      return
    }
    const urlParams = { ...rootStore.getGlbParams(), ...params };
    const urlWithParams = utils.queryString(url, urlParams);
    console.log(`\n\n===> ${url}\n===> 请求参数: `, JSON.stringify(urlParams, null, 4));

    data && console.log('===> 请求体: ', JSON.stringify(data, null, 4));

    const theHeader = utils.deepClone({ ...rootStore.getGlbHeader(), ...header }, true);
    (JSON.stringify(theHeader) !== '{}') && console.log('===> header: ', JSON.stringify(theHeader, null, 4), '\n\n');

    fetch.fetch({
      url: urlWithParams,
      data,
      header: theHeader,
      method,
      responseType,
      success(response) {
        resolve(response)
      },
      fail(error, code) {
        // prompt.showToast({
        //   message: error
        // })
        console.log(`\najax error(${code}) =`, JSON.stringify(error, null, 4))
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
    return request({ url: BASE_URL + url, params, method: 'GET', ...options });
  },
  post: function (url, data, options = {}, params = {}) {
    options.header = {
      // "Content-Type": 'application/x-www-form-urlencoded'
      "Content-Type": 'application/json'
    }
    return request({ url: BASE_URL + url, data, method: 'POST', ...options });
  },
  request
}

export default http
