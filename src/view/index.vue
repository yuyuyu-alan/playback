<template>
  <div class="room-show">
    <white-borard/>
    <trophy-animation/>
    <teacher-player />
    <student-player />
  </div>
</template>

<script>
import CloudHubPlayback from "cloudhub-playback-sdk";
import StreamController from "@/controllers/StreamController";
import RoomController from "@/controllers/RoomController";
import WhiteboardController from "@/controllers/WhiteboardController";
import LayoutController from "../controllers/LayoutController";
import TeacherPlayer from "../components/room/TeacherPlayer";
import StudentPlayer from "../components/room/StudentPlayer";
import Room from "../models/room/Room";
import whiteBorard from "../components/whiteBorard"
import TrophyAnimation from "../components/room/TrophyAnimation";
export default {
  components: {
    TeacherPlayer,
    StudentPlayer,
    whiteBorard,
    TrophyAnimation
  },
  data() {
    return {};
  },
  mounted() {
    this.init();
  },
  watch: {
    currLayoutType: function (e) {
      LayoutController.watchWindowResize();
    },
  },
  methods: {
    init() {
      if (CloudHubPlayback) {
        CloudHubPlayback.startPlay((room) => {
          console.log('start======================', room)
          let _currLayoutType = room.maxonlinevideos == 2 ? 2 : room.room.roomlayout
          this.$store.commit("setData", {
            rtcEngine: CloudHubPlayback.getEngine(),
            roomType: Number(room.room.roomtype),
            currLayoutType: Room.getRoomDefaultLayoutType(_currLayoutType),
          });
          LayoutController.watchWindowResize();
          StreamController.listen();
          RoomController.listen();
          WhiteboardController.listen();
        });
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
@import '../assets/css/app.styl';

.room-show {
  position: relative;
  padding-top: 60px;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  box-sizing: border-box;
}
</style>