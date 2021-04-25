export default class BaseLayout {
    constructor(config = {}) {
        this.margin = 20
        this.navHeight = 60
        this.docWidth = window.innerWidth
        this.docHeight = window.innerHeight - this.navHeight
        this.zIndex = 40
        if (config.hasOwnProperty('width')) {
            this.docWidth = config.width
        }

        if (config.hasOwnProperty('height')) {
            this.docHeight = config.height - this.navHeight
        }
    }
}
