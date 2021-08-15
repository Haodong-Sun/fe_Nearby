import Taro from '@tarojs/taro'

export const NeedTokenDomain = [];

export const NeedRefreshPath = [];

export const WebWhitelistDomain = [];

class Util {
    isLogin() {
        const token: any = this.getToken();
        return !!token;
    }

    getToken() {
        let token = '';
        try {
            const value = Taro.getStorageSync('accesstoken');
            if (value) {
                token = value;
            }
        } catch (e) {

        }
        return token;
    }

    goLogin() {
        Taro.navigateTo({
            url: '/page/login/index',
        })
    }

    // 节流函数，间隔wait时间执行
    throttle(fn: (...arg0: any) => void, wait: number | undefined) {
        let timer: any = null;
        return (...args: any) => {
            if (timer) {return; }
            timer = setTimeout(() => {
                fn(...args);
                timer = null;
            }, wait);
        }
    }

    // 防抖函数，执行最后一次
    debounce(fn: (...arg0: any) => void, wait: number | undefined) {
        let timer: any = null;
        return (...args: any) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                fn(...args);
            }, wait);
        };
    }

    // 防抖函数，执行一次，优先执行
    debouncePrev(fn: (...arg0: any) => void, wait: number | undefined) {
        let timer: any = null;
        return (...args: any) => {
            if (timer) {
                return;
            }
            fn(...args);
            timer = setTimeout(() => {
                timer && clearTimeout(timer);
                timer = null;
            }, wait);
        }
    }

    // fn返回promise，promise状态变更之后才可能继续执行
    execPromise(fn: (...arg0: any) => Promise<any>) {
        let promise: Promise<any> | undefined;
        let isExec = true; //是否可执行
        return (...args: any) => {
            if (!isExec) {
                return;
            }
            if (!promise) {
                promise = fn(...args);
                if  (Object.prototype.toString.call(promise) !== '[object Promise]') {
                    console.log('此函数需要返回promise');
                    return;
                }
                isExec = false;
            }
            promise && promise.finally(() => {
                isExec = true;
                promise = undefined;
            });
        }
    }

    // 还没懂
    deepClone(target: { [x:  string]: any; } | null, cache: any = []) {
        if (typeof target !== 'object' || target ===  null) {
            return target;
        }
        const hit = cache.filter((_) => _.origin ===  target);
        if (hit.length > 0) {
            return hit[0].copy;
        }
        const newTarget = Array.isArray(target) ? [] : {};
        cache.push({
            origin: target,
            copy: newTarget,
        })
        Object.keys(target).forEach((key) => {
            newTarget[key] = this.deepClone(target[key], cache);
        });
        return newTarget;
    }

    // 一维数组转二维数组
    arrTrans(arr: any[], num: number = 2) {
        const iconArr: any[] = [];
        arr.forEach((item: any, index: number) => {
            const page = Math.floor(index / num);
            if (!iconArr[page]) {
                iconArr[page] = [];
            }
            iconArr[page].push(item);
        });
        return iconArr;
    }

    getTouchDir (endX, endY, startX, startY) {
        let direction = '';
        if  (endX -startX > 50 && Math.abs(endY - startY) < 50) {
            direction = 'right';
        } else if (endX - startX < -50 && Math.abs(endY - startY) < 50) {
            direction = 'left';
        }
        return direction;
    }

    // 递归遍历书结构数据
    travelWidely(nodes:  any = [], dealNodeCb) {
        if (!Array.isArray(nodes)) {
            return nodes;
        }
        const queue = [...nodes];
        while(queue.length) {
            let node = queue.shift();
            if (node) {
                const dealNode = dealNodeCb && dealNodeCb(node);
                node = dealNode || node;
            }
            if (node && node.children && node.children.length) {
                queue.push(...node.children);
            }
        }
    }

    goH5(url: string) {
        Taro.navigateTo({
            url: `/pages/webview/index?url=${encodeURIComponent(url)}`,
        })
    }
}

export default new Util();
