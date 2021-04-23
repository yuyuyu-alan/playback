import Vue from 'vue';
import Vuex from 'vuex';
import Helper from "../helper";
import CloudHubPlayback from "cloudhub-playback-sdk";

Vue.use(Vuex);
const getDefaultState = () => {
	return {
		roomType: null,//房间类型 1v6还是1v1或其他的
		// roomStatus: ConstantController.ROOM_STATUS.NORMAL,//房间状态
		roomDuration: 0,//房间有效时长(s)
		roomObject: null,//房间信息
		currFocusIndex: -1,//当前上台用户的下标 -1 是老师
		currLayoutType: null,//当前的布局类型
		currLayout: null,//当前教室应该展示的布局
		whiteboardLayout: null,//白板的布局
		// whiteboardStatus: ConstantController.WHITEBOARD_STATUS.HIDE,//白板当前的状态
		studentLayouts: null,//学生的布局
		teacherLayout: null,//老师的布局
		isTwoFocus: false,//当前是否两人上台
		twoFocusIndex: null,//当前上台的两个人在 students 里的下标
		roomClient: null,//当前房间的客户端
		whiteboardClient: null,//当前白板的客户端
		whiteboardInstance: null,//当前房间白板的实例
		roomTrophies: null, //房间的奖杯
		chatMessages: [],//房间的聊天信息
		// chatStatus: ConstantController.CHAT_STATUS.ENABLE, //默认可以说话
		liveUserNum: 0, //直播间人数
		isPlayMedia: false, //当前是否正在播放媒体
		mediaInfo: null //当前正在播放的媒体信息
	};
};

export default new Vuex.Store({
	state: Helper.deepCopy(getDefaultState()),
	mutations: {
		setData(state, obj) {
			for (let i in obj) {
				state[i] = obj[i];
			}
		},
		setStudentLayoutsChild(state, {index, value}) {
			state.studentLayouts[index] = value;
		},
		resetTeacherLayout(state) {
			state.teacherLayout = state.currLayout.focus;
		},
		setChatMessage(state, obj) {
			state.chatMessages.push(obj);
		}
	},
	actions: {
		setData({commit}, obj) {
			commit('setData', obj);
		}
	},
	modules: {}
});