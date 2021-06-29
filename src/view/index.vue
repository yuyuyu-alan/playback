<template>
  <div class="room-show">
    <test/>
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
import test from "../components/test.vue"
export default {
  components: {
    TeacherPlayer,
    StudentPlayer,
    test
  },
  data() {
    return {};
  },
  mounted() {
    this.init();
  },
  watch: {
    currLayoutType: function (e) {
      console.log(
        `%c[ < bisdcdjscd-------- >------${JSON.stringify(e)} ]`,
        "color: aqua;background-color: black;font-size: 16px"
      );

      LayoutController.watchWindowResize();
    },
  },
  methods: {
    init() {
      if (CloudHubPlayback) {
        CloudHubPlayback.startPlay((room) => {
          // console.log(
          //   "==================================",
          //   room,
          //   "color: yelllow", room.room
          // );
          // 房间号  CloudHubPlayback.getChannelId()
          this.$store.commit("setData", {
            rtcEngine: CloudHubPlayback.getEngine(),
            roomType: Number(room.room.roomlayout),
            currLayoutType: Room.getRoomDefaultLayoutType(room.room.roomlayout),
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