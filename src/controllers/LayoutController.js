import DefaultLayout from "./layout/DefaultLayout";
import SingleToRightLayout from "./layout/SingleToRightLayout";
import SingleToBottomLayout from "./layout/SingleToBottomLayout";
import SingleLayout from "./layout/SingleLayout";
import SquareLayout from "./layout/SquareLayout";
import TwoFocus from "./layout/TwoFocus";
import store from '../stores';
import ConstantController from "./ConstantController";
import Helper from "../helper";

class LayoutController {
	constructor() {
		this.instance = null;
	}

	static getInstance() {
		if (!this.instance) {
			this.instance = new LayoutController();
		}
		return this.instance;
	}

	//获取所有的布局
	getLayouts(type, options = {}) {
		let layout = new DefaultLayout(this.getWindowSize());

		//todo 1v1
		if (type === 'single') {
			layout = new SingleLayout(this.getWindowSize());
			return {
				focus: layout.getTeacher(),
				students: [layout.getStudent()],
				whiteboard: layout.getWhiteboard()
			};
		}

		//todo 1v1 布局从左到右
		if (type === 'singleToRight') {
			layout = new SingleToRightLayout(this.getWindowSize());
			let singleLayout = new SingleLayout(this.getWindowSize());
			return {
				focus: singleLayout.getTeacher(),
				students: [singleLayout.getStudent()],
				newFocus: layout.getTeacher(),
				newStudents: [layout.getStudent()],
				whiteboard: layout.getWhiteboard()
			};
		}
		//todo 1v1 布局从上到下
		if (type === 'singleToBottom') {
			layout = new SingleToBottomLayout(this.getWindowSize());
			let singleLayout = new SingleLayout(this.getWindowSize());
			return {
				focus: singleLayout.getTeacher(),
				students: [singleLayout.getStudent()],
				newFocus: layout.getTeacher(),
				newStudents: [layout.getStudent()],
				whiteboard: layout.getWhiteboard()
			};
		}
		//todo 1v6 九宫格
		if (type === 'square') {
			const squareLayout = new SquareLayout(this.getWindowSize());
			const defaultLayout = new DefaultLayout(this.getWindowSize());
			return {
				focus: squareLayout.getTeacher(),
				students: squareLayout.getStudent(),
				whiteboard: defaultLayout.getWhiteboard()
			};
		}
		//todo 1v6 2人上台
		if (type === "twoFocus") {
			const twoFocusLayout = new TwoFocus({...this.getWindowSize(), ...options});
			const defaultLayout = new DefaultLayout(this.getWindowSize());
			return {
				...twoFocusLayout.getLayout(),
				whiteboard: defaultLayout.getWhiteboard()
			};
		}

		return {
			focus: layout.getTeacher(),
			students: layout.getStudent(),
			whiteboard: layout.getWhiteboard()
		};
	}

	getWindowSize() {
		return {
			width: window.innerWidth,
			height: window.innerHeight
		};
	}

	// todo 屏幕大小变化时更改相应视图的大小
	watchWindowResize() {
		const {currLayoutType, isTwoFocus, whiteboardStatus, mediaInfo = {}, isPlayMedia} = store.state;
		if (!currLayoutType) return;
		if (isTwoFocus) {
			this.changeTwoFocus();
			return false;
		}
		const layouts = this.getLayouts(currLayoutType);
		const {focus, students: studentLayouts, whiteboard} = layouts;
		const _whiteboardStatus = whiteboardStatus === ConstantController.WHITEBOARD_STATUS.SHOW;
		const _mediaStatus = isPlayMedia && mediaInfo.filetype === 'mp4';
		//适配 1v1 打开白板或媒体后的布局
		if ((currLayoutType).includes('singleTo') && (_whiteboardStatus || _mediaStatus)) {
			store.commit('setData', {
				studentLayouts: layouts.newStudents,
				teacherLayout: layouts.newFocus,
				whiteboardLayout: whiteboard
			});
		} else {
			store.commit('setData', {
				currLayout: Helper.deepCopy(layouts),
				studentLayouts,
				teacherLayout: focus,
				whiteboardLayout: whiteboard
			});
		}
		this.updateLayoutSize();
	}

	//todo 获取两人上台后的房间布局 并设置vuex
	changeTwoFocus() {
		const {twoFocusIndex} = store.state;
		const layouts = this.getLayouts('twoFocus', {twoFocusIndex});
		store.commit('setData', {
			studentLayouts: layouts.students,
			teacherLayout: layouts.teacher,
			whiteboardLayout: layouts.whiteboard
		});
	}

	//todo 根据当前屏幕大小 重新计算布局
	updateLayoutSize() {
		const {isTwoFocus, currLayoutType, currFocusIndex, studentLayouts, currLayout} = store.state;
		if (currLayoutType === 'default' && !isTwoFocus) {
			store.commit('setData', {
				teacherLayout: currFocusIndex !== -1 ? studentLayouts[currFocusIndex] : currLayout.focus
			});
			if (currFocusIndex !== -1) {
				store.commit('setStudentLayoutsChild', {
					index: currFocusIndex,
					value: currLayout.focus
				});
			}
		}
	}
}

export default LayoutController.getInstance();
