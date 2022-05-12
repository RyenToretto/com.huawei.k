import md5 from "md5";

import storage from '@system.storage';
import device from '@system.device';
import app from '@system.app'
import utils from './utils.js'

const SALT = '4582d6815e095be3d83fxvez6iuc4oer1mcff3844bba6c5f703dae669a9a6647';

const glbParams = {
    tk: '', // 用户唯一标识
    pkg: '', // 包名
    vn: '', // 版本名
    lang: '', // 语言
    ts: '', // 时间戳
    vc: '' // 版本code
}

const glbHeader = {
    accessToken: ''
};

const setGlbHeader = (obj) => {
    return new Promise(async (resolve) => {
        for (const [key, value] of Object.entries(obj)) {
            glbHeader[key] = value
            if (key === 'accessToken') {
                await utils.promiseFactory(storage.set, { key: 'access_token', value });
            }
        }
        resolve(glbHeader)
    });
};

const getGlbHeader = () => {
    return glbHeader
};

const setGlbParams = () => {
    return new Promise((resolve) => {
        const { packageName, versionName } = app.getInfo()
        glbParams.pkg = packageName
        glbParams.pkg = 'com.cherry.hnqn.video'
        glbParams.vn = versionName

        device.getId({
            type: ['device'],
            success: function ({ device }) {
                glbParams.tk = device;
            }
        });

        device.getInfo({
            success: (deviceInfo) => {
                glbParams.lang = deviceInfo.language
                setTimeout(() => {
                    resolve({
                        deviceInfo,
                        glbParams
                    })
                }, 300)
            }
        });
    });
}

const getGlbParams = () => {
    glbParams.ts = Date.now();
    const { tk, pkg, vn, lang, ts } = glbParams
    glbParams.vc = md5(tk + pkg + vn + lang + ts + SALT)
    return glbParams
}

const rootStore = {
    UPDATE_LOGIN: 'update_login',
    GET_LOGIN: 'get_login',
    INIT_DONE: 'init_done',
    glbParams,
    setGlbParams,
    getGlbParams,
    glbHeader,
    setGlbHeader,
    getGlbHeader
};

export default rootStore;
