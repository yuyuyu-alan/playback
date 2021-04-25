import BaseLayout from "./BaseLayout"

export default class TwoFocus extends BaseLayout {
    constructor(config = {}) {
        super(config)
        this.config = config
        this.getStudents()
    }

    setLayout() {
        let count = 5,
            items = [],
            width = (this.docWidth - ((count + 1) * this.margin)) / count,
            height = width / 16 * 9
        for (let i = 0; i < count; i++) {
            let x = this.margin * (i + 1) + width * i
            let y = this.docHeight - this.margin - height + this.navHeight
            // let y = this.docHeight
            items[i] = {
                width,
                height,
                x,
                y,
                zIndex: this.zIndex
            }
        }
        //5个位置是从左到右计算的 返回的学生位置需要更改一下
        return {
            teacher: items.splice(2, 1)[0],
            //约定展示位置是 3 1 0 2 4
            students: [items[1], items[2], items[0], items[3]]
        }
    }

    getFocus() {
        let count = 2,
            items = [],
            width = (this.docWidth - this.margin * 3) / 2,
            height = width / 16 * 9
        for (let i = 0; i < count; i++) {
            items[i] = {
                width,
                height,
                x: this.margin * (i + 1) + width * i,
                //y轴计算方式:窗口高 - 底部容器的位置 - 自己的高 / 2 + 顶栏的高度
                y: (this.docHeight - this.setLayout().teacher.height - this.margin - height) / 2 + this.navHeight,
                zIndex: this.zIndex
            }
        }
        return items
    }

    getStudents() {
        const {twoFocusIndex} = this.config
        const focusIndexArr = []
        const {students: studentLayout} = this.setLayout()
        let students = []
        //先把两个上台的用户位置添加进去
        twoFocusIndex.map((item, index) => {
            students[item] = this.getFocus()[index]
            focusIndexArr.push(item)
        })
        //双层循环添加剩余用户的位置
        for (let i = 0; i < studentLayout.length; i++) {
            for (let j = 0; j < 6; j++) {
                if (j !== focusIndexArr[0] && j !== focusIndexArr[1] && students[j] === undefined) {
                    students[j] = studentLayout[i]
                    break //设置完当前位置后 跳出最里边的 for 循环 防止多次赋值
                }
            }
        }
        return students
    }

    getLayout() {
        return {
            teacher: this.setLayout().teacher,
            students: this.getStudents()
        }
    }
}
