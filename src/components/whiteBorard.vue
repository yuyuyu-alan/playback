
<template>
  <div class="whiteboard-box" ref="whiteboardBox">
    <div id="defaultWhiteboardBox" ref="whiteboard"></div>
  </div>
</template>
<script>
import EventBus from "../eventBus";
import { mapState } from "vuex";
import LayoutController from "../controllers/LayoutController";
import WhiteboardController from "../controllers/WhiteboardController";

export default {
  name: "Whiteboard",
  computed: {
    ...mapState({
      isPlayMedia: "isPlayMedia",
      whiteboardStatus: "whiteboardStatus",
      currLayoutType: "currLayoutType",
      whiteboardLayout: "whiteboardLayout",
    }),
  },
  data() {
    return {
      whiteboardFiles: [],
    };
  },
  watch: {
    whiteboardLayout: {
      deep: true,
      handler: function () {
        this.setWhiteboardLayout();
      },
    },

    whiteboardStatus: function (value) {
      value && this.setWhiteboardLayout();

      //1v1特殊布局 打开白板后的布局
      if (this.currLayoutType.includes("singleTo") && !this.isPlayMedia) {
        const layouts = LayoutController.getLayouts(this.currLayoutType);
        this.$store.dispatch("setData", {
          studentLayouts: layouts[value ? "newStudents" : "students"],
          teacherLayout: layouts[value ? "newFocus" : "focus"],
          whiteboardLayout: layouts.whiteboard,
        });
      }
      const whiteboardDom = this.$refs["whiteboardBox"];
      whiteboardDom.style.zIndex = value ? this.whiteboardLayout.zIndex : -199;
    },
  },
  mounted() {
    EventBus.$on("showWhiteboard", (falg) => {
      this.$store.dispatch('setData', {
				whiteboardStatus: falg ? 1 : 0
			});
    });
  },
  methods: {
    setWhiteboardLayout() {
      this.$nextTick().then(() => {
        const whiteboardDom = this.$refs["whiteboardBox"];
        WhiteboardController.setWhiteboardLayout(
          whiteboardDom,
          this.whiteboardStatus
        );
      });
    },
  },
  beforeDestroy() {
    EventBus.$off("showWhiteboard");
  },
};
</script>

<style scoped lang="stylus">
@import '../assets/css/app.styl';

.whiteboard-box {
  position: absolute;
  box-sizing: border-box;
  z-index: -99;
  width: 100%;
  height: 100%;

  #defaultWhiteboardBox {
    width: calc(100%);
    height: 100%;
    box-sizing: border-box;
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    z-index: 11;
  }
}
</style>
