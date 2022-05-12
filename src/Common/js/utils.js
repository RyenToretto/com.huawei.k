/**
 * 您可以将常用的方法、或系统 API，统一封装，暴露全局，以便各页面、组件调用，而无需 require / import.
 */
const prompt = require('@system.prompt');
const decodeToken = '%[a-f0-9]{2}';
const singleMatcher = new RegExp(decodeToken, 'gi');
const multiMatcher = new RegExp('(' + decodeToken + ')+', 'gi');

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

const decodeComponents = (components, split) => {
    try { // Try to decode the entire string first
        return decodeURIComponent(components.join(''));
    } catch (err) {
    }

    if (components.length === 1) {
        return components;
    }

    split = split || 1;

    var left = components.slice(0, split); // Split the array in 2 parts
    var right = components.slice(split);

    return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
}

const decode = (regStr) => {
    try {
        return decodeURIComponent(regStr);
    } catch (err) {
        var tokens = regStr.match(singleMatcher);
        for (var i = 1; i < tokens.length; i++) {
            regStr = decodeComponents(tokens, i).join('');

            tokens = regStr.match(singleMatcher);
        }
        return regStr;
    }
}

const decodeUrl = (encodedURI) => { // Keep track of all the replacements and prefill the map with the `BOM`
    var replaceMap = {
        '%FE%FF': '\uFFFD\uFFFD',
        '%FF%FE': '\uFFFD\uFFFD'
    };

    var match = multiMatcher.exec(encodedURI);
    while (match) {
        try { // Decode as big chunks as possible
            replaceMap[match[0]] = decodeURIComponent(match[0]);
        } catch (err) {
            var result = decode(match[0]);

            if (result !== match[0]) {
                replaceMap[match[0]] = result;
            }
        }

        match = multiMatcher.exec(encodedURI);
    }

    // Add `%C2` at the end of the map to make sure it does not replace the combinator before everything else
    replaceMap['%C2'] = '\uFFFD';

    var entries = Object.keys(replaceMap);

    for (var i = 0; i < entries.length; i++) { // Replace all decoded components
        var key = entries[i];
        encodedURI = encodedURI.replace(new RegExp(key, 'g'), replaceMap[key]);
    }

    return encodedURI;
}

const getRealType = (obj) => {
    var toString = Object.prototype.toString
    var map = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object'
    }
    return map[toString.call(obj)]
}

const deepClone = (data, noEmptyProperty = false) => {
    let _type = getRealType(data)
    let copyOfObj

    if (_type === 'array') {
        copyOfObj = []
    } else if (_type === 'object') {
        copyOfObj = {}
    } else {
        return data
    }

    for (const [key, value] of Object.entries(data)) {
        if (noEmptyProperty && (value === '' || value === null || value === undefined)) {
            continue
        }
        copyOfObj[key] = deepClone(value)
    }

    return copyOfObj
}

const utils = {
    strToDate,
    lessTenFormat,
    queryString,
    showToast,
    showDialog,
    promiseFactory,
    decodeUrl,
    getRealType,
    deepClone
}

export default utils
