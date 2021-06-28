import store from "../store";
class WhiteboardController {
	constructor() {
		this.instance = null;
		this.CloudHubPlayback = null
	}

	static getInstance() {
		if (!this.instance) {
			this.instance = new WhiteboardController();
		}
		return this.instance;
	}

	listen() {
		this.initWhiteboardClient()
		this.CloudHubPlayback = require('cloudhub-playback-sdk').default;
		this.CloudHubPlayback.startPlay();

	}

	/** 初始化白板 */
	initWhiteboardClient() {
		const client = window.CloudHubWB.createClient({
			codec: "vp8",
			mode: "rtc",
		});


		let viewconfig = {
            isMoreDocument: true, //是否是多课件，如果是多课件则打开文档列表的文档时创建新的白板实例来展示白板，如果不是多课件，则直接在默认白板中进行切换文档
            isPlayback:true, //是否是回放
            wbcfg:{
				isSync: true,
				isCanDraw: true,
				isCanPage: true,
				isUseKeyboardPage: false,
				canvasBgColor: '#fff',
				isDisconnectCleaShapes: false,
				isAllowDynpptPubVideo: true //动态ppt的视频是否在外部播放
			} //白板实例配置项
        };
        window.CloudHubWBViewPlugin(client, 'defaultWhiteboardBox', viewconfig);
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
}

export default WhiteboardController.getInstance();
