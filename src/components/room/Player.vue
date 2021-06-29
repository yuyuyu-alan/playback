<template>
  <div
    class="player"
    id="hahah"
    :style="{
      'border-radius': isFocus && currLayoutType === 'default' ? 0 : '10px',
    }"
  >
    <div
      v-if="type === 'teacher'"
      class="video"
      :class="{ 'cover-video': currLayoutType === 'single' }"
      ref="teacher-player"
      id="teacher-player"
      :style="{ 'background-image': `url(${user.avatar})` }"
    ></div>
    <div
      v-if="type === 'student'"
      class="video"
      :class="{
        'cover-video': currLayoutType === 'single',
        'student-video': currLayoutType !== 'single',
      }"
      :ref="`player-${user.uid}`"
      :id="`player-${user.uid}`"
      :style="{ 'background-image': `url(${user.avatar})` }"
    ></div>
    
    
    <div class="bottom-bar" :class="[type==='student'?'student-bar':'']" @click.stop>
			<div class="title">{{user.nickname}}</div>
			<div class="right" v-if="roomStatus === roomStatusOptions.DOING">
			
				<el-popover placement="bottom-end" width="200" trigger="hover">
					<div class="trophy" v-if="type==='student'" slot="reference">
						<i class="Hydrus icon_bianzubeifen4" style="margin-right: 4px;"></i>
						<span>x{{user.trophyCount}}</span>
					</div>
					<div class="trophy-box">
						<template v-if="roomTrophies && roomTrophies.length>0">
							<div class="trophy-item" v-for="item in roomTrophies" :key="item.id"
								 @click="storeTrophy(user.uid,item)">
								<img class="trophy-icon" :src="item.icon" :alt="item.name">
								<div>{{item.name}}</div>
							</div>
						</template>
						<div v-else>暂无奖杯</div>
					</div>
				</el-popover>

			</div>
		</div>

  </div>
</template>

<script>
import { mapState } from "vuex";
import ConstantController  from "../../controllers/ConstantController"
export default {
  name: "Player",
  props: {
    type: {
      default: null,
      type: String,
    },
    user: {
      default: null,
      type: Object,
    },
    isFocus: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      roomStatusOptions: ConstantController.ROOM_STATUS, //房间状态
    };
  },
  computed: {
    ...mapState({
			roomStatus: 'roomStatus',
			currLayoutType: 'currLayoutType',
			roomTrophies: "roomTrophies"
       
    }),
  },
  mounted() {
    //老师 dom 存在就开始渲染老师的视频
    if (this.type === "teacher" && this.$refs["teacher-player"]) {
      this.$emit("ready");
    }
  },
};
</script>

<style scoped lang="stylus">
@import '../../assets/css/app.styl';

.player {
  border-radius: 10px;
  overflow: hidden;
  position: absolute;

  .bottom-bar {
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 3;
    width: 100%;
    height: 32px;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    cursor: pointer;

    .title {
      flex: 1;
      margin-left: 10px;
      color: white;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      color: white;
    }

    .action-btn {
      margin-right: 10px;

      i {
        font-size: 16px;
      }
    }

    .trophy {
      margin-right: 10px;
      display: flex;
      align-items: center;

      i {
        font-size: 16px;
      }
    }

    .audio-btn {
      margin-right: 10px;
      color: white;

      i {
        font-size: 18px;
      }
    }

    .network-status {
      display: flex;
      align-items: center;
      margin-right: 10px;
      font-size: 16px;

      i {
        margin-right: 5px;
        font-size: 16px;
      }
    }

    .tool {
      margin-right: 10px;

      i {
        font-size: 20px;
      }
    }
  }

  .student-bar {
    background: color_mint;
  }

  .video {
    width: 100%;
    height: 100%;
    background: color-gray-light;
    background-position: center 40%;
    background-repeat: no-repeat;
    background-size: 100%;
    z-index: 1;
  }

  .student-video {
    border: 5px solid color_mint;
    box-sizing: border-box;
    border-top-left-radius: 14px;
    border-top-right-radius: 14px;
    overflow: hidden;
  }
}

.trophy-box {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .trophy-item {
    display: flex;
    align-items: center;
    margin-right: 10px;
    font-size: 14px;
    color: #999;
    margin-bottom: 10px;
    cursor: pointer;

    .trophy-icon {
      width: 30px;
      object-fit: cover;
      margin-right: 5px;
    }
  }
}
</style>
<style lang="stylus">
.cover-video {
  video {
    object-fit: cover !important;
  }
}
</style>
