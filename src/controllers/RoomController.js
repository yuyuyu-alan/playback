import store from "../store";
// import {Message} from "element-ui";
// import swal from 'sweetalert';
// import UserController from "./UserController";
import Room from "../models/room/Room";
import StudentModel from "../models/student/Student";
import ConstantController from "./ConstantController";
import EventBus from "../eventBus";
import LayoutController from "./LayoutController";

class RoomController {
  constructor() {
    this.instance = null;
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new RoomController();
    }
    return this.instance;
  }

  /** 开始监听 */
  listen() {
    this.listenPubMsg();
    this.listenDelMsg();
    this.listenRoomUserJoined();
    this.listenRoomUserLeaved();
    // this.listenUserPropertyChanged();
    this.listenNetworkStateChanged();
  }

  /** 监听信令添加*/
  listenPubMsg() {
    const { rtcEngine } = store.state;
    rtcEngine.on("onPubMsg", (event) => {
      // todo 收到信令
      console.log("====收到信令=", event);
      const { msgName, data } = event;
      if (msgName === "showTrophy") {
        //发送奖杯
        EventBus.$emit("trophy", data);
      } else if (msgName === "ChangeLayout") {
        // LogController.printLog('ChangeLayout', data);
        //改变布局
        const { currLayoutType } = store.state;

        if (Number(data.layout) === ConstantController.LAYOUT_TYPE.SINGLE) {
          data.layout =
            currLayoutType === "singleToRight"
              ? ConstantController.LAYOUT_TYPE.SINGLE_TO_RIGHT
              : ConstantController.LAYOUT_TYPE.SINGLE_TO_BOTTOM;
        }

        //todo 如果布局是2人上台
        if (Number(data.layout) === ConstantController.LAYOUT_TYPE.TWO_FOCUS) {
          store.commit("setData", {
            currFocusIndex: -1,
            isTwoFocus: true,
            twoFocusIndex: data.userIndex,
          });
          LayoutController.changeTwoFocus();
        } else {
          store.commit("setData", {
            currLayoutType: Room.getRoomLayoutType(data.layout),
            isTwoFocus: false,
          });
        }
        //如果收到白板的信息 需要发送打开白板的信令
        if (data.whiteboardInfo) {
          this.sendSignalingMessage(
            data.whiteboardInfo.name,
            data.whiteboardInfo.data,
            data.whiteboardInfo.type
          );
        }

        if (Number(data.layout) === ConstantController.LAYOUT_TYPE.DEFAULT) {
          // 切回默认布局
          store.commit("setData", { currFocusIndex: -1 });
          LayoutController.watchWindowResize();
        }
      } else if (msgName === "AllForbidTalk") {
        // const { Teacher = {} } = store.state;
        // const { teacher } = Teacher;
        // //更改聊天状态
        // store.commit("setData", {
        //   chatStatus: ConstantController.CHAT_STATUS.DISABLE,
        // });
        // this.sendChatMessage(
        //   "老师开启了全体禁言",
        //   {
        //     nickname: "",
        //     type: ConstantController.CHAT_TYPE.SYSTEM,
        //   },
        //   teacher.uid
        // );
      } else if (msgName === "Notice_BigRoom_Usernum") {
        //记录直播房间人数
        // store.commit("setData", { liveUserNum: data.num });
      }
    });
  }

  listenDelMsg() {
    const { rtcEngine } = store.state;
    rtcEngine.on("onDelMsg", (event) => {
      console.log("====删除信令=", event);
      // const {id} = event;
      // if (id === 'AllForbidTalk') {
      // 	const {Teacher = {}} = store.state;
      // 	const {teacher} = Teacher;
      // 	store.commit('setData', {chatStatus: ConstantController.CHAT_STATUS.ENABLE});
      // 	this.sendChatMessage('老师关闭了全体禁言', {
      // 		nickname: '',
      // 		type: ConstantController.CHAT_TYPE.SYSTEM
      // 	}, teacher.uid);
      // }
    });
  }

  /** 用户进入房间 */
  listenRoomUserJoined() {
    const { rtcEngine } = store.state;
    rtcEngine.on("onUserJoined", (event) => {
      console.log("用户进入房间===", event);
      const { Student = {}, roomStatus } = store.state;
      const { items: students = [] } = Student;
      const { properties } = event;
      // // LogController.printLog("用户加入", event);
      if (properties.role === ConstantController.ROOM_ROLE.TEACHER) {
        // 老师进入
        store.commit("Teacher/setTeacher", properties);
      } else if (properties.role === ConstantController.ROOM_ROLE.STUDENT) {
        //查看是否之前进入过
        if (students.some((item) => item.uid === properties.uid)) {
          const index = students.findIndex(
            (item) => item.uid === properties.uid
          );
          for (let key in properties) {
            store.commit("Student/setProperty", {
              index,
              key,
              value: properties[key],
            });
          }
          store.commit("Student/setProperty", {
            index,
            key: "isShow",
            value: true,
          });
        } else {
          store.commit("Student/setItem", new StudentModel(properties));
        }
        // //如果上课后 进入的学生打开视频
        // if (roomStatus === ConstantController.ROOM_STATUS.DOING) {
        //   UserController.changeAudioStatus(
        //     properties.uid,
        //     ConstantController.STREAM_TYPE.VIDEO
        //   );
        // }
      } else if (properties.role === ConstantController.ROOM_ROLE.OBSERVER) {
        store.commit("Observer/setItem", properties);
      }
    });
  }

  /** 用户离开房间*/
  listenRoomUserLeaved() {
    const { rtcEngine } = store.state;
    rtcEngine.on("onUserLeaved", (event) => {
      console.log("用户离开房间==", event);
      // const {Student = {}, Observer, currFocusIndex} = store.state;
      // const {items: observer} = Observer;
      // const {items: students} = Student;
      // const {id} = event;
      // // LogController.printLog('用户离开', event);
      // if (students.some(item => item.uid === id)) {
      // 	const index = students.findIndex(item => item.uid === id);
      // 	//如果当前离开的学生是上麦状态的话
      // 	if (index === currFocusIndex) {
      // 		this.sendSignalingMessage('ToggleWindow', {user: students[index].uid}, 'delete');
      // 	}
      // 	store.commit('Student/setProperty', {index, key: 'isShow', value: false});
      // } else if (observer.some(item => item.uid === id)) {
      // 	store.commit('Observer/delItem', id);
      // }
    });
  }

  /** 用户属性改变*/
  listenUserPropertyChanged() {
    const { rtcEngine } = store.state;
    rtcEngine.on("user-properties-update", (event) => {
      // const {Teacher = {}, Student = {}} = store.state;
      // const {teacher = {}} = Teacher;
      // const {items: students = []} = Student;
      // const {id: uid, properties = {}} = event;
      // // LogController.printLog('用户属性改变', event);
      // // 判断是否是老师
      // if (teacher.uid === uid) {
      // 	for (let key in properties) {
      // 		store.commit('Teacher/setProperty', {key, value: properties[key]});
      // 	}
      // 	if (properties.streamType === ConstantController.STREAM_TYPE.VIDEO) {
      // 		teacher.stream.muteAudio();
      // 	} else if (properties.streamType === ConstantController.STREAM_TYPE.BOTH) {
      // 		teacher.stream.unmuteAudio();
      // 	}
      // 	store.commit('Teacher/setProperty', {
      // 		key: 'micStatus',
      // 		value: teacher.stream.isPubedAudio() ? ConstantController.MIC_STATUS.UNMUTE : ConstantController.MIC_STATUS.MUTE
      // 	});
      // } else if (students.some(item => item.uid === uid)) {
      // 	const index = students.findIndex(item => item.uid === uid);
      // 	for (let key in properties) {
      // 		store.commit('Student/setProperty', {index, key, value: properties[key]});
      // 	}
      // }
    });
  }

  /** 监听网络状态 */
  listenNetworkStateChanged() {
    const { rtcEngine } = store.state;
    rtcEngine.on("onConnectionStateChanged", (event) => {
      console.log("监听网络状态===", event);
    });
  }
}

export default RoomController.getInstance();
