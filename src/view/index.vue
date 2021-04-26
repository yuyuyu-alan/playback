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
import TeacherPlayer from "../components/room/TeacherPlayer";
import StudentPlayer from "../components/room/StudentPlayer";
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
  methods: {
    init() {
      if (CloudHubPlayback) {
        CloudHubPlayback.startPlay(() => {
          // 房间号  CloudHubPlayback.getChannelId()
          this.$store.commit("setData", {
            rtcEngine: CloudHubPlayback.getEngine(),
          });
          StreamController.listen();
          RoomController.listen();
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