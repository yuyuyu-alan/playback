<template>
	<div class="library-picker">
		<div class="top-upload-btn">
			<label for="uploadFile">
				上传课件
				<div class="dashed-box" v-if="getDashedBoxShow('upload')"></div>
			</label>
			<input class="upload-input" ref="uploadFile" type="file" id="uploadFile" @change="uploadFile">
		</div>
		<div class="file-item" @click="switchWhiteboardType(defaultFile)">
			{{defaultFile.filename}}
			<div class="dashed-box" v-if="getDashedBoxShow('whiteboard')"></div>
		</div>

		<div class="files-title">课件列表</div>
		<template v-if="files && files.length>0">
			<div class="file-item" v-for="(file,fileIndex) in files" :key="fileIndex"
				 @click="switchWhiteboardType(file)">
				{{file.filename}}
				<div class="dashed-box" v-if="getDashedBoxShow('files')&&(dashedBox.index-2)===fileIndex"></div>
			</div>
		</template>
	</div>
</template>

<script>
import EventBus from "../../../eventBus";
import {mapState} from 'vuex';
import WhiteboardController from "../../../controllers/WhiteboardController";
import StreamController from "@/controllers/StreamController";
import moment from "moment";
import store from "@/stores";

export default {
	name: "LibraryPicker",
	data() {
		return {
			defaultFile: {
				fileid: 0,
				filename: '白板',
				filetype: 'default'
			},
			files: [],
		};
	},
	computed: {
		dashedBox() {
			if (!EventBus.dashedBox) {
				EventBus.resetDashedBox();
			}
			return EventBus.dashedBox;
		},
		...mapState({
			roomClient: "roomClient",
			mediaInfo: "mediaInfo",
			isPlayMedia: "isPlayMedia",
			whiteboardClient: "whiteboardClient"
		})
	},
	mounted() {
		this.getFiles();

		EventBus.$on('libraryClickDashedBox', () => {
			let dashedItem = EventBus.dashedBox;
			if (dashedItem.isShow && dashedItem.status === 'library') {
				if (dashedItem.index <= 1) {
					switch (dashedItem.index) {
						case 0://上传课件按钮
							this.$refs.uploadFile && this.$refs.uploadFile.click();
							break;
						case 1://白板
							this.switchWhiteboardType(this.defaultFile);
							break;
					}
				} else {//课件列表
					let file = this.files[dashedItem.index - 2];
					this.switchWhiteboardType(file);
				}
			}
		});
	},
	methods: {
		getFiles() {
			this.whiteboardClient.getAllFileInfo(files => {
				files.map((item, index) => {
					item.filename = window.decodeURI(item.filename);
					if (item.fileid === 0) {
						files.splice(index, 1);
					}
				});
				this.files = files;
			}, {isGetMediaFile: true});
			/** 获取飞鼠控制时 课件的总数*/
			this.dashedBox.libraryCount = this.files.length + 2;
			EventBus.setDashedBox(this.dashedBox);

		},
		uploadFile({target}) {
			let curFile = target.files[0];
			if (!curFile) return false;
			this.$message({
				message: '上传课件中...',
				type: 'info',
				duration: 0
			});
			this.whiteboardClient.uploadFile({isDynamicPpt: false, file: curFile}, fileInfo => {
				this.$message.closeAll();
				this.$message.success('课件上传成功');
				this.files.push(fileInfo);
				this.switchWhiteboardType(fileInfo);
			}, () => {
				this.$message.closeAll();
				this.$message.error('上传文件失败,请重新上传');
			});
			//上传完成后清空file数据
			this.$refs['uploadFile'].value = '';
		},
		removeMediaStream() {
			return new Promise((resolve) => {
				if (this.isPlayMedia) {
					StreamController.removeInjectStreamUrl();
					setTimeout(() => {
						resolve();
					}, 50);
				} else {
					resolve();
				}
			});
		},
		switchWhiteboardType(file) {
			this.removeMediaStream().then(() => {
				if (['mp3', 'mp4'].includes(file.filetype)) { //播放媒体
					WhiteboardController.playMedia(file);
				} else {
					WhiteboardController.showWhiteboard(file);
				}
				EventBus.$emit('LibraryVisible');//关闭课件库
			});
		},
		getDashedBoxShow(name) {
			let dashedBox = this.dashedBox;
			if (dashedBox && dashedBox.status === 'library' && dashedBox.isShow) {
				switch (name) {
					case 'upload':
						return dashedBox.index === 0;
					case 'whiteboard':
						return dashedBox.index === 1;
					case 'files':
						return dashedBox.index > 1;
				}
			} else {
				return false;
			}
		},
	},
	beforeDestroy() {
		EventBus.$off('libraryClickDashedBox');
	}
};
</script>

<style scoped lang="stylus">
@import "../../../assets/css/app.styl"
.library-picker
	position fixed
	right 0
	top 0
	width 300px
	height calc(100%)
	z-index 51
	background #fff
	box-sizing border-box
	padding-top 60px

	.top-upload-btn
		display flex
		align-items center
		justify-content center
		padding 5px 10px

		label
			cursor pointer
			position relative
			background color_mint
			color #FFFFFF
			border-radius 50px
			padding 5px 25px

	.file-item
		cursor pointer
		position relative
		padding 10px 0 10px 5px
		border-bottom 1px solid #DDDDDD

		&:first-child
			border-bottom none

	.files-title
		padding 5px 0 5px 5px
		background color_mint
		color #FFFFFF

	.upload-input
		position fixed
		left -100vw
		top -100vh
</style>
