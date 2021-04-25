import BaseLayout from "./BaseLayout"

export default class SingleToBottomLayout extends BaseLayout {
    constructor(config = {}) {
        super(config)
    }

    getStudent() {
        return this.getToBottom().small.rightUser
    }

    getTeacher() {
        return this.getToBottom().small.leftUser
    }

    getWhiteboard() {
        return this.getToBottom().big
    }

    //todo 上 1 下 2
    getToBottom() {
        // todo 学生高 = 可展示区域的三分之一
        const studentHeight = (this.docHeight - this.margin * 3) / 3
        const studentWidth = studentHeight / 9 * 16
        //todo -60 是因为给翻页的控件留出地方
        const whiteboardHeight = this.docHeight - this.margin * 2 - studentHeight - 60
        const whiteboardWidth = whiteboardHeight / 9 * 16
        const whiteboardX = (this.docWidth - whiteboardWidth) / 2
        const whiteboardY = this.navHeight + this.margin
        const studentY = this.docHeight - studentHeight + this.navHeight
        return {
            small: {
                leftUser: {
                    width: studentWidth,
                    height: studentHeight,
                    margin: this.margin,
                    x: whiteboardX,
                    y: studentY,
                    zIndex: this.zIndex
                },
                rightUser: {
                    width: studentWidth,
                    height: studentHeight,
                    margin: this.margin,
                    x: studentWidth + whiteboardX + this.margin,
                    y: studentY,
                    zIndex: this.zIndex
                }
            },
            big: {
                width: whiteboardWidth,
                height: whiteboardHeight,
                margin: this.margin,
                x: whiteboardX,
                y: whiteboardY,
                zIndex: this.zIndex - 1
            }
        }
    }
}
