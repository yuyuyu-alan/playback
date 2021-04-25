import BaseLayout from "./BaseLayout"

export default class SquareLayout extends BaseLayout {
    constructor(config = {}) {
        super(config)
    }

    //获取 9 宫格里每个容器的尺寸
    getSize() {
        const height = (this.docHeight - this.margin * 4) / 3
        const width = height / 9 * 16
        return {
            width,
            height
        }
    }

    //获取中心容器的位置
    getCenterLocation() {
        const {width, height} = this.getSize()
        return {
            y: (this.docHeight - height) / 2 + this.navHeight,
            x: (this.docWidth - width) / 2
        }
    }

    getStudent() {
        let squareLayout = []
        const studentCount = 6
        const {width, height} = this.getSize()
        for (let i = 0; i < studentCount; i++) {
            squareLayout[i] = {
                width,
                height,
                zIndex: this.zIndex
            }
        }
        const {x: centerX, y: centerY} = this.getCenterLocation()
        //0:老师左边
        squareLayout[0].x = centerX - this.margin - width
        squareLayout[0].y = centerY
        //1:老师右边
        squareLayout[1].x = centerX + this.margin + width
        squareLayout[1].y = centerY
        //2:老师左上
        squareLayout[2].x = centerX - width / 2 - this.margin / 2
        squareLayout[2].y = centerY - this.margin - height
        //3:老师右上
        squareLayout[3].x = centerX + width / 2 + this.margin / 2
        squareLayout[3].y = squareLayout[2].y
        //4:老师左下
        squareLayout[4].x = squareLayout[2].x
        squareLayout[4].y = centerY + this.margin + height
        //5:老师右下
        squareLayout[5].x = squareLayout[3].x
        squareLayout[5].y = squareLayout[4].y
        return squareLayout
    }

    getTeacher() {
        const {width, height} = this.getSize()
        const {x, y} = this.getCenterLocation()
        return {
            width,
            height,
            x,
            y,
            zIndex: this.zIndex - 1
        }
    }
}
