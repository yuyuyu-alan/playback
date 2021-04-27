<template>
  <div class="student-player">
    <template v-for="(student, index) in students">
      <player
        v-if="student.isShow"
        type="student"
        :user="student"
        :key="index"
        :is-focus="currFocusIndex === index"
        :style="{
          width: studentLayouts[index].width + 'px',
          height: studentLayouts[index].height + 'px',
          left: studentLayouts[index].x + 'px',
          top: studentLayouts[index].y + 'px',
          zIndex: studentLayouts[index].zIndex,
        }"
      />
    </template>
  </div>
</template>

<script>
import Player from "./Player";
import { mapState } from "vuex";

export default {
  name: "StudentPlayer",
  components: { Player },
  computed: {
    ...mapState({
      studentLayouts: "studentLayouts",
      currFocusIndex: "currFocusIndex",
    }),
    ...mapState("Student/", {
      students: "items",
    }),
  },
  watch: {
    studentLayouts: {
      handler(e) {
        console.log("学生==============", e);
      }
    },
  },
};
</script>

<style scoped>
</style>
