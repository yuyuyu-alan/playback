import axios from "axios"
import config from "../../config";

export default class AuthService {

    static login(username, password) {
        return new Promise((resolve, reject) => {
            axios.request({
                baseURL: config.api.baseUrl,
                headers: {
                    Accept: config.api.accept,
                },
                method: "post",
                url: "/oauth/token",
                data: {
                    username: username,
                    password: password,
                    grant_type: 'password',
                    client_id: config.oauth.clientId,
                    client_secret: config.oauth.clientSecret
                }
            }).then(function (response) {
                let {tokenTypeKey, tokenKey} = config.oauth
                // 保存进浏览器
                localStorage.setItem(tokenKey, response.data.access_token)
                localStorage.setItem(tokenTypeKey, response.data.token_type)
                resolve(true)
            }).catch(function (error) {
                reject(error)
            })
        })
    }
}
