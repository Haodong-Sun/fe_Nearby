import Taro from '@tarojs/taro'
import Conf from '../conf/app'
import util from "./util";

export class Request {
    private baseUrl: string = Conf.baseAPI;

    preFetch(config = {}) {
        return config;
    }

    getEnv() {
        let  envType = '';
        const ENV_TYPE = Taro.getEnv();
        switch (true) {
            case ENV_TYPE === 'WEAPP':
                envType = 'wechat_applets';
                break;
            case ENV_TYPE === 'SWAN':
                envType = 'baidu_applets';
                break;
            case ENV_TYPE === 'TT':
                envType = 'toutiao_applets';
                break;
            default:
                envType = '';
        }
        return envType;
    }

    getVersion() {
        return Conf.version;
    }

    setToken(config: any = {}) {
        try {
            const token = util.getToken();
            if (token) {
                config.header['accesstoken'] = token;
                config.header['Access-Token'] = token;
            }
        } catch (e) {
            console.log(e);
        }
        return config;
    }

    async fetch({
        url,
        method,
        params,
        closeErrorTip = false, // 是否关闭错误提醒,
        header,
        // isRedirection = true, // 未登录状态下是否重定向到登陆页
                }: any) {
        method = method.toUpperCase();
        if (params && (method === 'GET' || method === 'DELETE')) {
            Object.keys(params).forEach((key) => {
                const item = params[key];
                if (item === null || item === undefined || item === '') {
                    delete params[key];
                }
            })
        }
        if (!/^https?/.test(url)) {
            url = `${this.baseUrl}${url}`;
        }
        const httpDefaultConfig = {
            method,
            url,
            data: params,
            header: {
                'Content-Type': 'application/json',
                'Utm-Source': this.getEnv(),
                'App-Version': this.getVersion(),
                ...header,
            }
        }
        const preConfig = this.preFetch(httpDefaultConfig);
        const config: any = this.setToken(preConfig);
        const res: any = await Taro.request(config).catch(error => ({error}));
        if (res.error) {
            if (!closeErrorTip) {
                Taro.showToast({title: '系统繁忙', icon: 'none'});
            }
            return Promise.reject(res.error);
        }

        if (res.statusCode === 200 && res.data) {
            // if (res.data.code === 10008) {
            //     Taro.removeStorageSync('assesstoken');
            //     isRedirection && util.goLogin();
            //     return Promise.reject(res.data);
            // }
            if (res.data.meta?.code === 0) {
                return res.data.data;
            }
            if (closeErrorTip) {
                return res.data.meta?.code;
            }
            Taro.showToast({title: res.data.meta?.msg || '网络错误', icon: "none"});
            return Promise.reject(res.data);
        }
        if (!closeErrorTip) {
            Taro.showToast({title: '网络错误', icon: 'none'});
        }
        return Promise.reject(res.data);
    }
}