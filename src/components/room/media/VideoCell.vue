<template>
	<div class="video-cell" :style="{'z-index':zIndex}">
		<slot></slot>
		<template v-if="showControl">
			<div class="content">
				<el-slider class="slider"
						   v-model="progressValue"
						   :min="minProgress"
						   :max="maxProgress"
						   @change="progressChanged"/>
				<div class="control-container">
					<i class="Hydrus icon_zanting" v-if="videoStatus==='play'"
					   @click="changeVideoPlayStatus('pause')"></i>
					<i class="Hydrus icon_zanting1" v-else-if="videoStatus === 'pause'"
					   @click="changeVideoPlayStatus('play')"></i>
					<span v-if="attributes">{{parseTime(progressValue)}} / {{parseTime(maxProgress)}}</span>
				</div>
			</div>
			<div class="close-btn" @click="closeVideo" v-if="showClose">
				<i class="Hydrus icon_close"></i>
			</div>
		</template>
	</div>
</template>

<script>
import {mapState} from 'vuex';
// import LogController from "@/controllers/LogController";
import StreamController from "@/controllers/StreamController";

export default {
	name: "VideoCell",
	props: {
		showControl: {
			type: Boolean,
			default: false
		},
		showClose: {
			type: Boolean,
			default: true
		},
		attributes: {
			type: Object,
			default: null
		}
	},
	computed: {
		...mapState({
			roomClient: "roomClient"
		})
	},
	watch: {
		roomClient: {
			immediate: true,
			handler: function (newClient) {
				if (newClient) {
					this.listenInjectStreamUrlStateChanged();
				}
			}
		},
		attributes: {
			immediate: true,
			handler: function (newInfo) {
				if (newInfo) {
					this.maxProgress = newInfo.duration;
					this.zIndex = 12;
					this.videoStatus = "play";
				} else {
					this.zIndex = -99;
					this.videoStatus = "pause";
				}
			}
		}
	},
	data() {
		return {
			zIndex: -99,
			progressValue: 0,
			minProgress: 0,
			maxProgress: 100,
			videoStatus: "pause"
		};
	},
	methods: {
		listenInjectStreamUrlStateChanged() {
			this.roomClient.on('injectstreamurl-state-change', event => {
				if (this.attributes && Object.keys(this.attributes).length <= 0) {
					return false;
				}
				const {stream, state = {}} = event;
				if (stream.getAttributes().fileid === this.attributes.fileid && state.hasOwnProperty('position')) {
					this.progressValue = state.position;
				}
			});
		},
		progressChanged(val) {
			if (this.attributes && Object.keys(this.attributes).length <= 0) {
				return false;
			}
			const {url, duration} = this.attributes;
			const seekPosition = val / duration * 100;
			this.roomClient.seekInjectStreamUrl(url, seekPosition, {}, error => {
				// LogController.printLog('快进媒体失败', error);
			});
		},
		changeVideoPlayStatus(val) {
			this.videoStatus = val;
			StreamController.pauseInjectStreamUrl(val === 'pause');
		},
		closeVideo() {
			StreamController.removeInjectStreamUrl();
		},
		parseTime(time) {
			const second = time / 1000;
			let temp_hours = this.timeAddZero(Math.floor((second % 86400) / 3600));
			let temp_minutes = this.timeAddZero(Math.floor(((second % 86400) % 3600) / 60));
			let temp_seconds = this.timeAddZero(Math.floor(((second % 86400) % 3600) % 60));
			if (temp_hours > 0) {
				return `${temp_hours}:${temp_minutes}:${temp_seconds}`;
			} else if (temp_minutes > 0) {
				return `00:${temp_minutes}:${temp_seconds}`;
			}
			return `00:00:${temp_seconds}`;
		},
		timeAddZero(time) {
			if (time <= 9) {
				return '0' + time;
			}
			return time;
		}
	}
};
</script>

<style scoped lang="stylus">
@import "../../../assets/css/app.styl"
.video-cell
	position absolute
	left 0
	top 0
	width 100%
	height 100%
	display flex
	align-items center
	flex-direction column
	background black

	.content
		position absolute
		left 50%
		bottom 10px
		transform translateX(-50%)
		width 90%
		background rgba(0, 0, 0, 0.5)
		color #fff
		display none

		.slider
			width 100%
			height 6px

			/deep/ .el-slider__runway
				margin 0

			/deep/ .el-slider__button
				border none

		.control-container
			margin 10px 0 0 -8px
			display flex
			align-items center

			i
				cursor pointer
				font-size 28px
				color #fff

			span
				margin-left 10px

	.close-btn
		position absolute
		right 10px
		top 10px
		width 40px
		height 40px
		border-radius 50%
		display flex
		align-items center
		justify-content center
		cursor pointer

		i
			color #fff
			font-size 20px

	&:hover .content
		display block
</style>
