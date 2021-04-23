<template>
  <div>首页</div>
</template>

<script>
import CloudHubPlayback from "cloudhub-playback-sdk";

export default {
  data() {
    return {
      globalInfo: {
        rtcEngine: null,
        users: {},
      },
    };
  },
  methods: {
    init() {
      if (CloudHubPlayback) {
        //开始进入回放
        CloudHubPlayback.startPlay((e) => {
          // 房间号  CloudHubPlayback.getChannelId()
          console.log("-----data=", e);
          this.globalInfo.rtcEngine = CloudHubPlayback.getEngine();
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
</style>