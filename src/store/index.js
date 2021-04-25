import Vue from 'vue';
import Vuex from 'vuex';
import Helper from "../helper";
// import CloudHubPlayback from "cloudhub-playback-sdk";

Vue.use(Vuex);
const getDefaultState = () => {
	return {
		roomGlobalInfo: null // 播放界面全局对象
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
		setStudentLayoutsChild(state, {index, value}) { // 学生布局
			state.studentLayouts[index] = value;
		},
		resetTeacherLayout(state) { // 老师布局
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