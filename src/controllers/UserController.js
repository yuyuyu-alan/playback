import {setStorageItem, getStorageItem} from "../localStorage";
import moment from "moment";
import store from '../stores';
import {Message} from 'element-ui';
import ConstantController from "./ConstantController";
import StreamController from "./StreamController";
import RoomController from "./RoomController";

class UserController {
	constructor() {
		this.instance = null;
	}

	static getInstance() {
		if (!this.instance) {
			this.instance = new UserController();
		}
		return this.instance;
	}

	listen() {
		this.listenPubMsg();
		this.listenDelMsg();
	}

	/** 监听信令添加*/
	listenPubMsg() {
		const {roomClient} = store.state;
		roomClient.on('onPubMsg', event => {
			let {id, data} = event;
			if (id === 'ToggleWindow') {
				this.toggleWindowAction(data.user);
			}
		});
	}

	/** 监听信令删除*/
	listenDelMsg() {
		const {roomClient} = store.state;
		roomClient.on('onDelMsg', event => {
			let {id, data} = event;
			if (id === 'ToggleWindow') {
				this.resetTeacherWindow(data.isNextSwitch);
			}
		});
	}

	changeAudioStatus(uid, status) {
		this.changeUserProperty(uid, {'streamType': status});
	}

	changeUserProperty(uid, property) {
		RoomController.setProperties(uid, property);
	}

	changeAllUserProperty(users, property) {
		let userIds = [];
		users.map(item => {
			userIds.push(item.uid);
		});
		RoomController.setProperties(userIds, property);
	}

	setClientRole(type = 'audience') {
		const {roomClient} = store.state;
		roomClient.setClientRole(type);
	}

	toggleWindow(userId) {
		/**限制切换频率 5s一次*/
		const localToggleTime = getStorageItem('toggleWindowTime');
		if (localToggleTime) {
			const toggleTime = moment().diff(moment(localToggleTime), 'seconds');
			if (toggleTime < 5) return Message.warning('切换频率过快,请稍后');
		}
		setStorageItem('toggleWindowTime', moment());
		/**老师上麦*/
		if (userId.includes('teacher')) {
			RoomController.sendSignalingMessage('ToggleWindow', {}, 'delete');
		} else {
			const {currFocusIndex} = store.state;
			/**如果麦上有学生 就先把老师置回麦上再切换*/
			const isNextSwitch = currFocusIndex >= 0;
			if (isNextSwitch) RoomController.sendSignalingMessage('ToggleWindow', {isNextSwitch}, 'delete');
			RoomController.sendSignalingMessage('ToggleWindow', {user: userId}, 'publish');
		}
	}

	/** 切换窗口*/
	toggleWindowAction(userId) {
		const {Student = {}, currFocusIndex, studentLayouts, currLayout, Teacher = {}} = store.state;
		const {items: students} = Student;
		const {teacher} = Teacher;
		const index = students.findIndex(item => item.uid === userId);
		if (index >= 0) {
			const oldLayout = studentLayouts[index];
			store.commit('setStudentLayoutsChild', {
				index,
				value: currLayout.focus
			});
			if (currFocusIndex < 0) {
				store.commit('setData', {teacherLayout: oldLayout});
				StreamController.setVideoProfile(teacher.stream, ConstantController.VIDEO_PROFILE.SMALL);
			}
			this.changeAudioStatus(userId, ConstantController.STREAM_TYPE.BOTH);
			store.commit('setData', {currFocusIndex: index});
		}
	}

	/** 重置老师位置 */
	resetTeacherWindow(isNextSwitch) {
		const {Student = {}, currFocusIndex, currLayout, Teacher = {}} = store.state;
		const {items: students} = Student;
		const {teacher} = Teacher;
		if (currFocusIndex === -1) return false;
		/**让上麦的学生回原位*/
		store.commit('setStudentLayoutsChild', {
			index: currFocusIndex,
			value: currLayout['students'][currFocusIndex]
		});
		this.changeAudioStatus(students[currFocusIndex].uid, ConstantController.STREAM_TYPE.VIDEO);
		store.commit('resetTeacherLayout');
		//三方切换 不用给老师开麦
		if (!isNextSwitch) {
			this.changeAudioStatus(teacher.uid, ConstantController.STREAM_TYPE.BOTH);
		}
		store.commit('setData', {currFocusIndex: -1});
		StreamController.setVideoProfile(teacher.stream, ConstantController.VIDEO_PROFILE.BIG);
	}
}


export default UserController.getInstance();
