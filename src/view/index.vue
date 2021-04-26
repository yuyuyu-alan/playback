<template>
  <div class="room-show ">
    <teacher-player />
    <student-player />
  </div>
</template>

<script>
import CloudHubPlayback from "cloudhub-playback-sdk";
import StreamController from "@/controllers/StreamController";
import RoomController from "@/controllers/RoomController"
import UserController from "@/controllers/UserController"
import LayoutController from "../controllers/LayoutController";
import TeacherPlayer from "../components/room/TeacherPlayer";
import StudentPlayer from "../components/room/StudentPlayer";
import Room from "../models/room/Room";
export default {
  components: {
    TeacherPlayer,
    StudentPlayer
  },
  data() {
    return {};
  },
  mounted() {
    this.init();
  },
  watch: {
    currLayoutType: function () {
			LayoutController.watchWindowResize();
		},
  },
  methods: {
    init() {
      if (CloudHubPlayback) {
        CloudHubPlayback.startPlay((room) => {
          // 房间号  CloudHubPlayback.getChannelId()
          this.$store.commit("setData", {
            rtcEngine: CloudHubPlayback.getEngine(),
            roomType: Number(room.roomlayout),
						currLayoutType: Room.getRoomDefaultLayoutType(room.roomlayout)
          });
         
          StreamController.listen();
          RoomController.listen();
          UserController.listen();
        });
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
@import '../assets/css/app.styl';

.room-show 
  position relative
  padding-top 60px
  width 100vw
  height 100vh
  overflow hidden
  box-sizing border-box
</style>