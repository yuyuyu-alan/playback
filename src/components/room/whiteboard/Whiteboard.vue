<template>
	<div class="whiteboard-box" ref="whiteboardBox">
		<whiteboard-video-container/>
		<div id="whiteboard" ref="whiteboard"></div>
		<div class="close" @click="closeWhiteboard">
			<i class="Hydrus icon_bianzubeifen2"></i>
		</div>
		<div class="no-whiteboard" v-if="whiteboardStatus===whiteboardStatusOptions.HIDE"></div>
	</div>
</template>
<script>
import EventBus from "../../../eventBus";
import {mapState} from 'vuex';
import LayoutController from "../../../controllers/LayoutController";
import WhiteboardController from "../../../controllers/WhiteboardController";
import WhiteboardVideoContainer from "@/components/room/whiteboard/WhiteboardVideoContainer";
// import LogController from "@/controllers/LogController";
import ConstantController from "@/controllers/ConstantController";

export default {
	name: "Whiteboard",
	components: {WhiteboardVideoContainer},
	computed: {
		...mapState({
			isPlayMedia: "isPlayMedia",
			whiteboardInstance: "whiteboardInstance",
			whiteboardStatus: "whiteboardStatus",
			currLayoutType: 'currLayoutType',
			whiteboardLayout: "whiteboardLayout",
			whiteboardClient: "whiteboardClient",
			roomClient: "roomClient"
		})
	},
	data() {
		return {
			whiteboardFiles: [],
			whiteboardStatusOptions: ConstantController.WHITEBOARD_STATUS
		};
	},
	watch: {
		whiteboardStatus: function (value) {
			value && this.setWhiteboardLayout();

			//1v1特殊布局 打开白板后的布局
			if (this.currLayoutType.includes('singleTo') && !this.isPlayMedia) {
				const layouts = LayoutController.getLayouts(this.currLayoutType);
				this.$store.dispatch('setData', {
					studentLayouts: layouts[value ? "newStudents" : "students"],
					teacherLayout: layouts[value ? "newFocus" : "focus"],
					whiteboardLayout: layouts.whiteboard
				});
			}
			const whiteboardDom = this.$refs['whiteboardBox'];
			whiteboardDom.style.zIndex = value ? this.whiteboardLayout.zIndex : -199;

		},
		whiteboardLayout: {
			deep: true,
			handler: function () {
				this.setWhiteboardLayout();
			}
		},
		whiteboardClient: function (newVal) {
			if (newVal && !this.whiteboardInstance) {
				this.initWhiteboard();
				this.listenPubMsg();
			}
		}
	},
	mounted() {
		EventBus.$on('showWhiteboard', file => {
			if (file) {
				this.setFile(file);
				const oldFile = this.whiteboardFiles.find(item => item.fileid === file.fileid);
				this.changeDocument(file.fileid, oldFile && oldFile.currpage ? oldFile.currpage : 1);
			} else {
				this.changeDocument();
			}
			this.$store.dispatch('setData', {
				whiteboardStatus: file ? 1 : 0
			});
		});
	},
	methods: {
		initWhiteboard() {
			this.$nextTick().then(() => {
				const whiteboardId = this.$refs['whiteboard'].id;
				WhiteboardController.initWhiteboard(whiteboardId);
			});
		},
		listenPubMsg() {
			this.roomClient.on('recv-pub-msg', event => {
				const {name, data} = event;
				if (name === 'ShowPage') {
					this.setFileCurrentPage(data.filedata);
				}
			});
		},
		setFileCurrentPage(file) {
			const index = this.whiteboardFiles.findIndex(item => item.fileid === file.fileid);
			if (index >= 0) {
				this.whiteboardFiles[index].currpage = file.currpage;
			}
		},
		setFile(file) {
			const isExist = this.whiteboardFiles.some(item => item.fileid === file.fileid);
			!isExist && this.whiteboardFiles.push(file);
		},
		closeWhiteboard() {
			WhiteboardController.delWhiteboard();
			//关闭时 置回白板 防止下次打开会先展示一下上一次的课件
			this.changeDocument();
		},
		changeDocument(fileId = 0, page = 1) {
			if (this.whiteboardInstance) {
				this.whiteboardInstance.openDocument(fileId, page);
			}
		},
		setWhiteboardLayout() {
			this.$nextTick().then(() => {
				const whiteboardDom = this.$refs['whiteboardBox'];
				WhiteboardController.setWhiteboardLayout(whiteboardDom, this.whiteboardStatus);
			});
		}
	},
	beforeDestroy() {
		EventBus.$off('showWhiteboard');
	}
};
</script>

<style scoped lang="stylus">
@import "../../../assets/css/app.styl"
.whiteboard-box
	position absolute
	box-sizing border-box
	z-index -99
	width 100%
	height 100%

	.no-whiteboard
		width 100%
		height 100%
		position absolute
		left 0
		bottom 0
		z-index 40
		background color-gray

	#whiteboard
		width calc(100%)
		height 100%
		box-sizing border-box
		position absolute
		left 50%
		bottom 0
		transform translateX(-50%)
		z-index 11

	.close
		position absolute
		right 0
		top 0
		box-shadow 0 2px 4px rgba(0, 0, 0, .5)
		z-index 12
		width 40px
		height 40px
		background #fff
		border-radius 50%
		display flex
		align-items center
		justify-content center

		i
			font-size 18px
</style>
