import store from "../stores";
import ConstantController from "./ConstantController";
import EventBus from "../eventBus";
import Config from "../config";
import RoomController from "./RoomController";
// import LogController from "@/controllers/LogController";
import StreamController from "@/controllers/StreamController";

class WhiteboardController {
	constructor() {
		this.instance = null;
	}

	static getInstance() {
		if (!this.instance) {
			this.instance = new WhiteboardController();
		}
		return this.instance;
	}

	listen() {
		this.listenPubMsg();
		this.listenDelMsg();
	}

	/** 初始化白板 */
	initWhiteboardClient() {
		const client = window.CloudHubWB.createClient({
			codec: "vp8",
			mode: "rtc",
		});
		store.commit("setData", {whiteboardClient: client});
		client.init(Config.ys.appId);
	}

	initWhiteboard(id) {
		const {whiteboardClient} = store.state;
		const config = {
			wbcfg: {
				isSync: true,
				isCanDraw: true,
				isCanPage: true,
				isUseKeyboardPage: false,
				canvasBgColor: '#fff',
				isDisconnectCleaShapes: false,
				isAllowDynpptPubVideo: true //动态ppt的视频是否在外部播放
			},
			isCreateWbToolBar: true,
			isCreateDocumentToolBar: true
		};
		store.commit("setData", {whiteboardInstance: window.CloudHubWBViewPlugin(whiteboardClient, id, config)});
		this.listenDynamicPptPubVideo();
	}

	/**
	 * 打开白板信令
	 * */
	showWhiteboard(file) {
		this.singleShowWhiteboard(file);
		RoomController.sendSignalingMessage("showWhiteboard", {file}, "publish");

	}

	// todo 1v1 开白板时 会改变流的布局 需要发送ChangeLayout
	singleShowWhiteboard(file) {
		const {currLayoutType} = store.state;
		if (currLayoutType.includes("singleTo")) {
			const layout = currLayoutType === "singleToRight" ? ConstantController.LAYOUT_TYPE.SINGLE_TO_RIGHT : ConstantController.LAYOUT_TYPE.SINGLE_TO_BOTTOM;
			let options = {
				layout
			};
			if (file) {
				options['whiteboardInfo'] = {
					name: "showWhiteboard",
					data: {file},
					type: "publish",
				};
			}
			RoomController.sendSignalingMessage("ChangeLayout", options, "publish");
		}
	}

	/** 发送删除白板 */
	delWhiteboard(options = {}) {
		RoomController.sendSignalingMessage("showWhiteboard", options, "delete");
	}

	playMedia(file) {
		// LogController.printLog('playMedia', file);
		const {rtcEngine, currLayoutType} = store.state;
		const url = this._getMediaUrl(file.swfpath);
		store.dispatch('setData', {isPlayMedia: true, mediaInfo: {...file, url}}).then(() => {
			file.filetype !== 'mp3' && this.singleShowWhiteboard(); //兼容1v1
			this.delWhiteboard();  //播放前关闭白板
			if (file.filetype === 'mp3' && currLayoutType.includes('single')) {
				RoomController.sendSignalingMessage(
					"ChangeLayout",
					{layout: ConstantController.LAYOUT_TYPE.SINGLE},
					"publish"
				);
			}
			rtcEngine.addInjectStreamUrl(url, {
				toID: window.CloudHubRTC.CONSTANTS.MSG_TO_ALLUSER,
				isvideofile: file.filetype === 'mp4',
				pauseWhenOver: false,
				attributes: {
					url,
					filetype: file.filetype,
					fileid: file.fileid,
					isVideo: file.filetype === 'mp4',
					isMedia: true
				}
			}, error => {
				console.error('-', error);
				// LogController.printLog('播放媒体失败', error);
			});
		});
	}

	_getMediaUrl(swfpath) {
		const prefix = 'http://rddoccdnws.roadofcloud.net';
		const index = swfpath.lastIndexOf('.');
		const path = swfpath.replace(swfpath.slice(index), `-1${swfpath.slice(index)}`);
		return `${prefix}${path}`;
	}

	/** 监听发送信令*/
	listenPubMsg() {
		const {rtcEngine} = store.state;
		rtcEngine.on("onPubMsg", (event) => {
			let {id, data} = event;
			switch (id) {
				case "showWhiteboard": //打开白板
					EventBus.$emit("showWhiteboard", data.file);
					break;
				case "AssistantWhiteboard": //助教打开白板
					this.showWhiteboard(data.file);
					break;
				case "PauseInjectStream":
					StreamController.pauseInjectStreamUrl(true);
					break;
				case "RemoveInjectStream":
					StreamController.removeInjectStreamUrl();
					break;
			}
		});
	}

	/** 监听删除信令*/
	listenDelMsg() {
		const {rtcEngine, isPlayMedia} = store.state;
		rtcEngine.on("onDelMsg", (event) => {
			const {currLayoutType} = store.state;
			const {id} = event;
			switch (id) {
				case "showWhiteboard":
					// const { isPlayMedia } = store.state;
					if (currLayoutType.includes("singleTo") && !isPlayMedia) {
						RoomController.sendSignalingMessage(
							"ChangeLayout",
							{layout: ConstantController.LAYOUT_TYPE.SINGLE},
							"publish"
						);
					}
					EventBus.$emit("showWhiteboard", null);
					break;
				case "PauseInjectStream":
					StreamController.pauseInjectStreamUrl(false);
					break;
			}
		});
	}

	listenDynamicPptPubVideo() {
		const {whiteboardInstance, rtcEngine} = store.state;
		whiteboardInstance.on("dynamic-ppt-pub-video", (event) => {
			// LogController.printLog('listenDynamicPptPubVideo', event);
			const {data, currpage, docProtocol, useDocAddr, docPort, swfpath} = event;
			const url = `${docProtocol}://${useDocAddr}:${docPort}${swfpath}/${data.url}`;
			const options = {
				toID: window.CloudHubRTC.CONSTANTS.MSG_TO_ALLUSER,
				isvideofile: true,
				pauseWhenOver: false,
				attributes: {
					url,
					fileid: data.fileid,
					currpage,
					isVideo: true
				}
			};
			store.commit('setData', {isPlayMedia: false, mediaInfo: {...event, url}});
			rtcEngine.addInjectStreamUrl(url, options, error => {
				// LogController.printLog('播放ppt视频失败', error);
				console.error('=', error);
			});
		});
	}

	setWhiteboardLayout(whiteboardDom, status) {
		const {currLayoutType, whiteboardInstance, whiteboardLayout} = store.state;
		switch (currLayoutType) {
			case 'singleToRight':
			case 'singleToBottom':
				whiteboardDom.style.left = whiteboardLayout.x + 'px';
				whiteboardDom.style.top = whiteboardLayout.y + 'px';
				break;
			case 'single':
			case 'square':
			case 'default':
				whiteboardDom.style.left = "50%";
				whiteboardDom.style.transform = "translateX(-50%)";
				whiteboardDom.style.bottom = "100px";
				break;
		}
		whiteboardDom.style.width = whiteboardLayout.width + 'px';
		whiteboardDom.style.height = whiteboardLayout.height + 'px';
		whiteboardDom.style.zIndex = status ? whiteboardLayout.zIndex : -199;
		if (whiteboardInstance) {
			whiteboardInstance.resizeWhiteboard();
		}
	}
}

export default WhiteboardController.getInstance();
