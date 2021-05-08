import {setStorageItem, getStorageItem} from "../localStorage";
import moment from "moment";
import store from '../store';
import { Message } from 'element-ui';
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
		const {rtcEngine} = store.state;
		rtcEngine.on('onPubMsg', event => {
			let {msgId, fromId} = event;
			console.log(`%c[ < =====监听信令添加 >------ ]` , 'color: aqua;background-color: black;font-size: 16px');
			console.log('=====', msgId)
			if (msgId === 'ToggleWindow') {
				this.toggleWindowAction(fromId);
			}
		});
	}

	/** 监听信令删除*/
	listenDelMsg() {
		const {rtcEngine} = store.state;
		rtcEngine.on('onDelMsg', event => {
			let {msgId, fromId} = event;
			if (msgId === 'ToggleWindow') {
				// this.resetTeacherWindow(data.isNextSwitch);
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
		const {rtcEngine} = store.state;
		rtcEngine.setClientRole(type);
	}

	/** 切换窗口*/
	toggleWindowAction(userId) {
		const {Student = {}, currFocusIndex, studentLayouts, currLayout, Teacher = {}} = store.state;
		const {items: students} = Student;
		const {teacher} = Teacher;
		const index = students.findIndex(item => item.uid === userId);
		console.log(`%c[ < 切换窗口======= >------ ]` , 'color: aqua;background-color: black;font-size: 16px');
		console.log(userId, '====', index)
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
}


export default UserController.getInstance();
