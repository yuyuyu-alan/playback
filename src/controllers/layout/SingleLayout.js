import BaseLayout from "./BaseLayout"

export default class SingleLayout extends BaseLayout {
    constructor(config = {}) {
        super(config)
        this.margin = 20
    }

    getStudent() {
        return this.getSingleLayout('right')
    }

    getTeacher() {
        return this.getSingleLayout('left')
    }

    getSingleLayout(position) {
        //1v1 用户视频 4:3
        let width = (this.docWidth - this.margin * 3) / 2,
            height = width / 4 * 3,
            x = (this.docWidth - width * 2 - this.margin) / 2,
            y = (this.docHeight - height) / 2 + this.navHeight

        return {
            width,
            height,
            x: position === 'left' ? x : this.docWidth - x - width,
            y,
            zIndex: this.zIndex
        }
    }

    getWhiteboard() {
        let whiteboardWidth = this.docWidth / 2
        return {
            width: whiteboardWidth,
            height: whiteboardWidth / 16 * 9,
            zIndex: this.zIndex - 1
        }
    }
}
