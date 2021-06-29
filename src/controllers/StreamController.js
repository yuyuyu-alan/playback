import store from "../store";

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
  }

  /** 初始化流 */
  initStream() {
    return new Promise((resolve) => {
      const { teacher } = store.state.Teacher;
      const { uid, streamType } = teacher
      setTimeout(() => {
        let videoEl = document.getElementById('teacher-player')
        this.playVideo(uid, videoEl, streamType);
      }, 100)
      resolve();
      return false;
    });
  }

  /** 播放视频 */
  playVideo(uid, view, type) {
    const { rtcEngine } = store.state;
    if (!view) return false;
    rtcEngine.setupRemoteVideo(uid, type, view);
  }

  /** 远端流添加 */
  listenStreamAdded() {
    const { rtcEngine } = store.state;
    rtcEngine.on("onRemoteVideoStateChanged", (event) => {
      console.log('===================123======', event)
      const { mediaType, uid } = event;
      const user_type = event.uid.split('_')[0]
      if (user_type == 'teacher') {
        setTimeout(() => {
          let videoEl = document.getElementById('teacher-player')
          this.playVideo(uid, videoEl, mediaType);
        }, 100)
      } else if (user_type == 'user') { setTimeout(() => {
          const videodom = document.getElementById(`player-${event.uid}`)
          this.playVideo(event.uid, videodom, event.mediaType);
        }, 100)

      }
    });
  }
}

export default StreamController.getInstance();
