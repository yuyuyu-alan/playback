export default class ResponseError {

    constructor(jsonObject) {
        this.statusCode = jsonObject.status_code
        this.message = jsonObject.message
        if (jsonObject.errors) {
            this.detail = jsonObject.errors
        }
        if (this.statusCode < 300) {
            this.type = 'success'
        } else if (this.statusCode < 500) {
            this.type = 'warning'
        } else {
            this.type = 'error'
        }
        this.onClose = function () {

        }
        this.onClick = function () {

        }
    }

}