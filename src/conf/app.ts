class Conf {
    baseAPI = '';
    version = ''; // 小程序版本号

    constructor() {
        this.baseAPI = this.setBaseUrl();
    }

    setBaseUrl() {
        const protocolHttp = 'http://';
        const protocolHttps = 'https://';
        let baseAPI = '';
        switch (true) {
            case process.env.NODE_ENV === 'development':
                baseAPI = `${protocolHttp}47.104.186.111:8090`; // 测试接口域名
                break;
            case process.env.NODE_ENV === 'production':
                baseAPI = `${protocolHttps}`; // 线上接口域名
                break;
            default:
                baseAPI = ''
        }
        return baseAPI;
    }

    getHostUrl() {
        // const protocolHttp = 'http://';
        const protocolHttps = 'https://';
        let hostUrl = '';
        switch (true) {
            case process.env.NODE_ENV === 'development':
                hostUrl = `${protocolHttps}47.104.186.111:8090`; // 测试接口域名
                break;
            case process.env.NODE_ENV === 'production':
                hostUrl = `${protocolHttps}`; // 线上接口域名
                break;
            default:
                hostUrl = ''
        }
        return hostUrl;
    }
}

export default new Conf();