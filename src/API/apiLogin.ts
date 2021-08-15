import { Request } from "../utils/request";

class Login extends Request{
    getInfo(params?: any) {
        return this.fetch({
            url: '',
            methods: '',
            params,
        });
    }
}

export default new Login();