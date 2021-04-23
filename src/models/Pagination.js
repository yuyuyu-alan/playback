export default class Pagination {
    constructor(data) {
        this.total = data.total
        this.count = data.count
        this.per_page = data.per_page
        this.current_page = data.current_page
        this.total_pages = data.total_pages
    }
}