<template>
  <div>
    <Player/>
  </div>
</template>

<script>
import CloudHubPlayback from "cloudhub-playback-sdk";
import Player from "@/components/room/Player"
export default {
  components: {
    Player
  },
  data() {
    return {
    };
  },
  methods: {
    init() {
      if (CloudHubPlayback) {
        //开始进入回放
        CloudHubPlayback.startPlay(() => {
          // 房间号  CloudHubPlayback.getChannelId()
          this.$store.commit("setData", {
            roomGlobalInfo: {
              rtcEngine: CloudHubPlayback.getEngine(),
            }
          });
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
</style>