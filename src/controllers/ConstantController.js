class ConstantController {
	constructor() {
		this.instance = null;
		this.roomType();
		this.layoutType();
		this.roomStatus();
		this.roomRole();
		this.whiteboardStatus();
		this.streamType();
		this.micStatus();
		this.videoProfile();
		this.chatStatus();
		this.chatType();
	}

	static getInstance() {
		if (!this.instance) {
			this.instance = new ConstantController();
		}
		return this.instance;
	}

	//房间类型
	roomType() {
		this.ROOM_TYPE = {
			DEFAULT: 1, //1 对多
			SINGLE: 2,//1v1
			LIVE: 3, //直播
		};
	}

	//房间布局类型
	layoutType() {
		this.LAYOUT_TYPE = {
			DEFAULT: 0, //1 对多 默认布局
			SQUARE: 1,//9 宫格
			SINGLE: 2,//1v1 默认布局
			SINGLE_TO_RIGHT: 3, //1v1 左右布局
			SINGLE_TO_BOTTOM: 4, //1v1 上下布局
			TWO_FOCUS: 5 //1 对多 两人上台
		};
	}

	//房间状态
	roomStatus() {
		this.ROOM_STATUS = {
			NORMAL: 0, //未上课
			DOING: 1,//上课中
			END: 2//已结束
		};
	}

	//房间角色
	roomRole() {
		this.ROOM_ROLE = {
			TEACHER: 0, //老师
			ASSISTANT: 1, //助教
			STUDENT: 2, //学生
			AUDIENCE: 3, //观众
			OBSERVER: 4, //观摩
		};
	}

	//白板状态
	whiteboardStatus() {
		this.WHITEBOARD_STATUS = {
			HIDE: 0, //关闭
			SHOW: 1 //打开
		};
	}

	//流类型
	streamType() {
		this.STREAM_TYPE = {
			NONE: 0, //全部关闭
			AUDIO: 1,//只有音频
			VIDEO: 2,//只有视频
			BOTH: 3 //音视频都有
		};
	}

	//用户麦克风图标状态
	micStatus() {
		this.MIC_STATUS = {
			MUTE: 0, //静音
			UNMUTE: 1 //未静音
		};
	}

	//视频分辨率
	videoProfile() {
		this.VIDEO_PROFILE = {
			BIG: {  //上台
				width: 640,
				height: 360,
				fps: 10
			},
			SMALL: {  //下台
				width: 320,
				height: 240,
				fps: 10
			}
		};
	}

	//聊天状态
	chatStatus() {
		this.CHAT_STATUS = {
			DISABLE: 0, //禁言
			ENABLE: 1 // 不禁言
		};
	}

	//消息类型
	chatType() {
		this.CHAT_TYPE = {
			SYSTEM: 1, //系统消息
			NORMAL: 2 //默认消息
		};
	}
}


export default ConstantController.getInstance();
