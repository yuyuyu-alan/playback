import Http from "../services/Http"
import Pagination from "./Pagination"
import Helper from "../helper"

export default class BaseModel {
    constructor(data = null) {
        if (data != null) {
            if (data instanceof Object) {
                let properties = Object.getOwnPropertyNames(data)
                properties.forEach(property => {
                    let key = Helper.toHump(property)
                    this[key] = data[property]
                })
            } else {
                throw "data is not object"
            }
        }
        // 白名单
    }

    static index(url, params = {}) {
        return new Promise((resolve, reject) => {
            if (!url) {
                reject('request url is required')
                return
            }
            let _this = this
            Http({
                method: 'get',
                url,
                params
            }).then(function (response) {
                if (!response.data.data && response.data) {
                    if (response.data instanceof Array) {
                        let items = []
                        response.data.map(item => items.push(new _this(item)))
                        resolve(items)
                    } else {
                        resolve(response.data)
                    }
                }
                let data = response.data.data
                let pagination = null
                if (response.data.meta && response.data.meta.pagination) {
                    let paginationData = response.data.meta.pagination
                    if (paginationData) {
                        pagination = new Pagination(paginationData)
                    }
                }
                let items = []
                data && data.forEach(function (data) {
                    const item = new _this(data)
                    items.push(item)
                })
                resolve({items, pagination})
            }).catch(function (error) {
                reject(error)
            })
        })
    }

    static show(url, params = {}) {
        return new Promise((resolve, reject) => {
            if (!url) {
                return reject('request url is required')
            }
            let _this = this
            Http({
                method: 'get',
                url,
                params
            }).then(function (response) {
                if (!response.data.data && response.data) {
                    const item = new _this(response.data)
                    resolve(item)
                }
                let data = response.data.data
                const item = new _this(data)
                resolve(item)
            }).catch(function (error) {
                reject(error)
            })
        })
    }

    static save(method, url, params = {}) {
        return new Promise((resolve, reject) => {
            if (!url) {
                return reject('request url is required')

            }
            if (method !== 'PUT' && method !== 'POST' && method !== 'GET') {
                return reject('method is not support')
            }

            // if (method === 'PUT' && !Object.keys(params).length) {
            //     resolve(true)
            //     return
            // }
            let options = {
                method,
                url,
            }
            if (method === 'POST') {
                options.data = params
            } else {
                options.params = params
            }
            Http(options).then(function (response) {
                resolve(response.headers.location)
            }).catch(error => {
                reject(error)
            })
        })
    }

    static delete(url) {
        return new Promise((resolve, reject) => {
            if (!url) return reject('request url is required')

            Http({
                method: 'delete',
                url,
            }).then(() => resolve(true)).catch(error => reject(error))
        })
    }
}
