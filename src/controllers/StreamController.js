import store from "../store";
import ConstantController from "./ConstantController";

class StreamController {
  constructor() {
    this.instance = null;
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new StreamController();
    }
    return this.instance;
  }

  /** 开始监听 */
  listen() {
    this.listenStreamAdded();
    this.listenStreamMutedAudio();
  }

  /** 初始化流 */
  initStream() {
    return new Promise((resolve, reject) => {
      const { teacher } = store.state.Teacher;
      if (teacher.hasOwnProperty("stream")) {
        this.playVideo("teacher-player", teacher.stream);
        resolve();
        return false;
      }
      const StreamConfig = {
        uid: teacher.uid,
        type: "video",
        sourceID: "default_source_id",
      };
      const stream = window.CloudHubRTC.createStream(StreamConfig);
      store.commit("Teacher/setProperty", { key: "stream", value: stream });
      stream.init({}, (err) => {
        err && reject(err);
        this.setVideoProfile(stream, ConstantController.VIDEO_PROFILE.BIG);
        this.playVideo("teacher-player", stream);
        resolve();
      });
    });
  }

  /** 播放视频 */
  playVideo(uid, domId, stream, type) {
    if (!stream || !domId) return false;
    stream.setupRemoteVideo(uid, type, domId);
  }

  /** 播放音频 */
  playAudio(stream) {
    if (!stream) return false;
    stream.playAudio({}, (error) => {
      if (error) {
        console.log("播放音频失败", stream, error);
      }
    });
  }

  /** 停止播放音频 */
  unPlayAudio(stream) {
    if (!stream) return false;
    stream.unplayAudio();
  }

  /** 远端流添加 */
  listenStreamAdded() {
    const { rtcEngine } = store.state;
    rtcEngine.on("onRemoteVideoStateChanged", (event) => {
      // LogController.printLog('远端流添加', event);
	  const { state, mediaType, uid, streamId } = event;
	  
      this.playVideo(uid, "teacher-player", rtcEngine, mediaType);
      console.log("======接收到流数据=", event);
      // const {Student = {}} = store.state;
      // const {items: students} = Student;
      // const {stream} = event;
      // const streamType = stream.getType();
      // if (streamType === 'video') {
      // 	students.some(item => item.uid === stream.getUserId()) && this.subscribeStream(stream);
      // } else if (streamType === 'media') {
      // 	this.subscribeStream(stream);
      // }
    });
  }

  /** 远端流音频发生变化 */
  listenStreamMutedAudio() {
    const { rtcEngine } = store.state;
    rtcEngine.on("onRemoteAudioStateChanged", (event) => {
      // LogController.printLog('流音频关闭', event);
      console.log("远端流音频变化=", event);
      // const {stream} = event;
      // const userId = stream.getUserId();
      // this.unPlayAudio(stream);
      // this.updateStreamAudioStatus(stream, userId);
    });
  }
}

export default StreamController.getInstance();
