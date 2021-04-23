import axios from "axios"
import Router from "../router"
import Config from "../config"
import ResponseError from "../models/ResponseError"

export default function Http(options) {
    return new Promise((resolve, reject) => {
        let getAccessToken = function () {
            let tokenTypeKey = Config.oauth.tokenTypeKey
            let tokenKey = Config.oauth.tokenKey
            let type = window.localStorage.getItem(tokenTypeKey)
            if (!type) {
                type = 'Bearer'
            }
            let token = window.localStorage.getItem(tokenKey)
            return type + " " + token
        }
        const instance = axios.create({
            baseURL: Config.api.baseUrl,
            headers: {
                Accept: Config.api.accept,
                Authorization: getAccessToken(),
                'phone-system': 'web',
                'Access-Control-Expose-Headers': 'Location'
            }
        })

        //request 拦截器
        instance.interceptors.request.use(
            config => {
                if (config.method === "post") {
                    // Config.data = qs.stringify(Config.data)
                }
                return config
            },
            error => {
                return Promise.reject(error)
            }
        )

        // response 拦截器
        instance.interceptors.response.use((response) => {
                return response
            },
            error => {
                let responseError = new ResponseError({
                    message: '未知错误',
                    status_code: 500
                })
                if (error && error.response) {
                    let response = error.response.data
                    responseError = new ResponseError(response)

                    switch (error.response.status) {
                        case 400:
                            responseError.message = "请求失败"
                            responseError.detail = {
                                error: error.response.data.message
                            }
                            break
                        case 401:
                            responseError.message = "登陆超时"
                            responseError.detail = {
                                login: '请重新进行登录'
                            }

                            Router.push('/login')

                            break
                        case 403:
                            responseError.message = "拒绝访问"
                            responseError.detail = {
                                error: error.response.data.message
                            }
                            break
                        case 404:
                            responseError.message = `请求地址出错: ${error.response.config.url}`
                            responseError.detail = {
                                error: error.response.data.message
                            }
                            break
                        case 408:
                            responseError.message = "请求超时"
                            break
                        case 422:
                            responseError.message = "请求参数错误"
                            break
                        case 500:
                            responseError.message = "服务器内部错误"
                            responseError.detail = {
                                error: error.response.data.message
                            }
                            break
                        case 501:
                            responseError.message = "服务未实现"
                            break
                        case 502:
                            responseError.message = "网关错误"
                            break
                        case 503:
                            responseError.message = "服务不可用"
                            break
                        case 504:
                            responseError.message = "请求方法不允许"
                            break
                        case 505:
                            responseError.message = "HTTP版本不受支持"
                            break
                        default:
                    }
                }
                return Promise.reject(responseError)
            }
        )

        //请求处理
        instance(options)
            .then(response => {
                resolve(response)
                return false
            })
            .catch(error => {
                reject(error)
            })
    })

}
