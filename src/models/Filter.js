import * as dateFormat from 'dateformat'

export default class Filter {
    constructor(data) {
        this.status = null
        this.beginAt = null
        this.endAt = null
        this.keyword = null
        if (data.status) {
            this.status = data.status
        }
        if (data.beginAt) {
            this.beginAt = data.beginAt
        }
        if (data.endAt) {
            this.endAt = data.endAt
        }
        if (data.keywords) {
            this.keywords = data.keywords
        }
    }

    toOptions() {
        let options = {}
        if (this.status) {
            options.status = this.status
        }
        if (this.beginAt) {
            options.begin_at = dateFormat(this.beginAt, 'yyyy-mm-dd HH:MM:ss')
        }
        if (this.endAt) {
            if (this.endAt.getHours() === 0 &&
                this.endAt.getMinutes() === 0 &&
                this.endAt.getSeconds() === 0) {
                options.end_at = dateFormat(this.endAt, 'yyyy-mm-dd 00:00:00')
            } else {
                options.end_at = dateFormat(this.endAt, 'yyyy-mm-dd HH:MM:ss')
            }
        }
        if (this.keywords) {
            options.keywords = this.keywords
        }
        if (Object.keys(options).length === 0) {
            return null
        }
        return options
    }
}