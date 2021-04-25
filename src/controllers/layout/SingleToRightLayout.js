import BaseLayout from "./BaseLayout"

export default class SingleToRightLayout extends BaseLayout {
    constructor(config = {}) {
        super(config)
    }

    getStudent() {
        return this.getToRight().small.user2
    }

    getTeacher() {
        return this.getToRight().small.user1
    }

    getWhiteboard() {
        return this.getToRight().big

    }

    getToRight() {
        //左 2 右 1
        const height = (this.docHeight - this.margin * 3) / 2
        const width = height / 3 * 4
        //todo -60 右边空出来白板画笔栏的位置
        const whiteboardWidth = this.docWidth - width - this.margin * 2 - 60
        const whiteboardHeight = whiteboardWidth / 16 * 9
        const userX = this.margin
        return {
            small: {
                user1: {
                    width,
                    height,
                    margin: this.margin,
                    x: userX,
                    y: this.navHeight + this.margin,
                    zIndex: this.zIndex
                },
                user2: {
                    width,
                    height,
                    margin: this.margin,
                    x: userX,
                    y: this.navHeight + height + this.margin * 2,
                    zIndex: this.zIndex
                }
            },
            big: {
                width: whiteboardWidth,
                height: whiteboardHeight,
                margin: this.margin,
                x: width + this.margin * 2,
                y: (this.docHeight - whiteboardHeight) / 2 + this.navHeight,
                zIndex: this.zIndex - 1
            }
        }
    }
}
