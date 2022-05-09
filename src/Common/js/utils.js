/**
 * 您可以将常用的方法、或系统 API，统一封装，暴露全局，以便各页面、组件调用，而无需 require / import.
 */
const prompt = require('@system.prompt');

const strToDate = function (dateStr) {
    let splitArr = dateStr.split(' ');
    let dateArr = splitArr[0].split('-');
    let timeArr = splitArr[1] ? splitArr[1].split(':') : [];
    let newDate = new Date();
    newDate.setFullYear(dateArr[0]);
    newDate.setMonth(Number(dateArr[1]) - 1);
    newDate.setDate(dateArr[2]);
    newDate.setHours(timeArr[0] || 0, timeArr[1] || 0, timeArr[2] || 0, timeArr[3] || 0);
    return newDate;
}

const lessTenFormat = function (num) {
    if (isNaN(num) || num < 0) {
        return '';
    }
    let newNum = Number(num);
    return newNum >= 10 ? newNum : `0${num}`
}

/**
 * 拼接 url 和参数
 */
const queryString = (url, query) => {
    let str = [];
    for (let key in query) {
        str.push(key + '=' + query[key]);
    }
    let paramStr = str.join('&');
    return paramStr ? `${url}?${paramStr}` : url;
}

const showToast = (message = '', duration = 0, gravity = 'center') => {
    if (!message) { return; }
    prompt.showToast({
        message: message,
        duration,
        gravity
    });
}

const showDialog = (args) => {
    if (!args) { return; }
    prompt.showDialog(args);
}

const promiseFactory = (callback, params = {}) => {
    return new Promise((resolve, reject) => {
        params = Object.assign({
            success: (data) => { resolve(data); },
            fail: (err, code) => { reject(err, code) }
        }, params);
        callback(params);
    });
}

const utils = {
    strToDate,
    lessTenFormat,
    queryString,
    showToast,
    showDialog,
    promiseFactory
}

export default utils
