import store from "../store";
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
    this.listenNetworkStateChanged();
  }

  /** 监听信令添加*/
  listenPubMsg() {
    const { rtcEngine } = store.state;
    rtcEngine.on("onPubMsg", (event) => {
      // todo 收到信令
      console.log(`%c[ < 收到信令 >---${event.msgName}---${JSON.stringify(event.data)} ]`, 'color: red;background-color: black;font-size: 16px');

      const { msgName, data } = event;
      if(msgName === 'ClassBegin') {
        store.commit('setData', {roomStatus: ConstantController.ROOM_STATUS.DOING});
      }
      if(msgName === 'showWhiteboard') { // 显示白板
        EventBus.$emit("showWhiteboard", true);
      } else if (msgName === "showTrophy") { // 奖杯相关
        //发送奖杯
        EventBus.$emit("trophy", data);

      } else if (msgName === "ChangeLayout") {
        //改变布局
        const { currLayoutType } = store.state;
        if (Number(data.layout) === ConstantController.LAYOUT_TYPE.SINGLE) { // defaule layout
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
       

        if (Number(data.layout) === ConstantController.LAYOUT_TYPE.DEFAULT) {
          // 切回默认布局
          store.commit("setData", { currFocusIndex: -1 });
          LayoutController.watchWindowResize();
        }
      }
    });
  }

  listenDelMsg() {
    const { rtcEngine } = store.state;
    rtcEngine.on("onDelMsg", (event) => {
      const { msgName } = event;
      if(msgName === "showWhiteboard") { // 关闭白板
        EventBus.$emit("showWhiteboard", false);

      }
    });
  }

  /** 用户进入房间 */
  listenRoomUserJoined() {
    const { rtcEngine } = store.state;
    rtcEngine.on("onUserJoined", (event) => {
      console.log("用户进入房间===", event);
      const { properties } = event;
      if (properties.role === ConstantController.ROOM_ROLE.TEACHER) {
        // 老师进入
        store.commit("Teacher/setTeacher", properties);
      } else if (properties.role === ConstantController.ROOM_ROLE.STUDENT) {
        // 学生
        store.commit("Student/setItem", new StudentModel(properties));
      } else if (properties.role === ConstantController.ROOM_ROLE.OBSERVER) {
        // 
        store.commit("Observer/setItem", properties);
      }
    });
  }

  /** 用户离开房间*/
  listenRoomUserLeaved() {
    const { rtcEngine } = store.state;
    rtcEngine.on("onUserLeaved", (event) => {
      console.log("用户离开房间==", event);
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
