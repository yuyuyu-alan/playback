<template>
  <div class="teacher-player">
    <player
      v-if="teacher"
      type="teacher"
      :user="teacher"
      :is-focus="currFocusIndex === -1 && !isTwoFocus"
      @ready="playVideo"
      :style="{
        width: teacherLayout.width + 'px',
        height: teacherLayout.height + 'px',
        left: teacherLayout.x + 'px',
        top: teacherLayout.y + 'px',
        zIndex: teacherLayout.zIndex,
      }"
    />

    <scale-loader class="loading-bar" :loading="loading" color="#ffffff" />
  </div>
</template>

<script>
import { ScaleLoader } from "@saeris/vue-spinners";
import Player from "./Player";
import { mapState } from "vuex";
import StreamController from "../../controllers/StreamController";
export default {
  name: "TeacherPlayer",
  components: { Player, ScaleLoader },
  data() {
    return {
      loading: true,
    };
  },
  computed: {
    ...mapState({
      currFocusIndex: "currFocusIndex",
      isTwoFocus: "isTwoFocus",
      teacherLayout: "teacherLayout",
    }),
    ...mapState("Teacher/", {
      teacher: "teacher",
    }),
  },
  methods: {
    playVideo() {
      StreamController.initStream()
        .then(() => {
          this.loading = false;
        })
        .catch((error) => {
          console.log(`playTeacher error ${error}`);
        });
    },
  },
  watch: {
    teacherLayout: {
      handler(e) {
        console.log("老师==================", e);
      }
    },
  },
};
</script>

<style scoped lang="stylus">
.loading-bar {
  width: 100%;
  z-index: 666;
  height: 100vh;
  position: absolute;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
