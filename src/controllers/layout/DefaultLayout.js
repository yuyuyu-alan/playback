import BaseLayout from "./BaseLayout"

export default class DefaultLayout extends BaseLayout {
    constructor(config = {}) {
        super(config)
        this.studentHeight = (this.docHeight - 100) / 3
        this.studentWidth = this.studentHeight / 9 * 16
        this.studentCount = 6
    }

    getStudent() {
        let items = []
        for (let i = 0; i < this.studentCount; i++) {
            let x = i % 2 === 0 ? this.margin : this.docWidth - this.studentWidth - this.margin
            let y = 80 + Math.floor(i / 2) * (this.studentHeight + this.margin)
            items[i] = {
                width: this.studentWidth,
                height: this.studentHeight,
                x,
                y,
                zIndex: this.zIndex
            }
        }
        return items
    }

    getTeacher() {
        return {
            width: this.docWidth,
            height: this.docHeight,
            x: 0,
            y: this.navHeight,
            zIndex: this.zIndex - 1
        }
    }

    getWhiteboard() {
        let whiteboardWidth = this.docWidth - (this.studentWidth + this.margin) * 2 - this.margin * 2
        return {
            width: whiteboardWidth,
            height: whiteboardWidth / 16 * 9,
            zIndex: this.zIndex + 1
        }
    }
}
