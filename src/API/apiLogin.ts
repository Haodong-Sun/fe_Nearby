import { Request } from "../utils/request";

class Login extends Request{
    goLogin(params?: any) {
        return this.fetch({
            url: '/user_center/wx_login',
            method: 'POST',
            closeErrorTip: true,
            params,
        });
    }

    goRegister(params?: any) {
        return this.fetch({
            url: '/user_center/wx_register',
            method: 'POST',
            params,
        })
    }
}

export default new Login();