<template>
  <div>
    <Player />
  </div>
</template>

<script>
import CloudHubPlayback from "cloudhub-playback-sdk";
import Player from "@/components/room/Player";
import StreamController from "@/controllers/StreamController";
import RoomController from "@/controllers/RoomController"
export default {
  components: {
    Player,
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

<style lang="less" scoped>
</style>