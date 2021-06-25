<template>
	<div class="whiteboard-video-container">
		<video-cell v-if="curAttribute" show-control :show-close="false" :attributes="curAttribute">
			<div style="width:100%;height:100%;" ref="whiteboardVideoEle"></div>
		</video-cell>
	</div>
</template>

<script>
import {mapState} from 'vuex';
import VideoCell from "@/components/room/media/VideoCell";
import uuid from 'uuid/v4';
import StreamController from "@/controllers/StreamController";

export default {
	name: "WhiteboardVideoContainer",
	components: {VideoCell},
	computed: {
		...mapState({
			isPlayMedia: "isPlayMedia",
			roomClient: "roomClient"
		})
	},
	data() {
		return {
			curStream: null,
			curAttribute: null
		};
	},
	watch: {
		roomClient: {
			handler: function (newClient) {
				if (newClient) {
					newClient.on('stream-subscribed', this.listenStreamSubscribed.bind(this));
					newClient.on('stream-removed', this.listenStreamRemoved.bind(this));
					newClient.on('recv-pub-msg', this.listenPubMsg.bind(this));
					newClient.on('recv-del-msg', this.listenDelMsg.bind(this));
				}
			}
		}
	},
	methods: {
		listenStreamSubscribed(event) {
			const {stream} = event;
			const attribute = stream.getAttributes();
			if (stream && stream.getType() === 'media' && !attribute.isMedia) {
				this.curAttribute = attribute;
				this.curStream = stream;
				this.$nextTick().then(() => {
					this.$refs['whiteboardVideoEle'].id = 'whiteboard_' + uuid();
					StreamController.playVideo(this.$refs['whiteboardVideoEle'].id, stream, {fit: 'contain'});
					StreamController.playAudio(stream);
				});
			}
		},
		listenStreamRemoved(event) {
			const {stream} = event;
			const attribute = stream.getAttributes();
			if (stream && stream.getType() === 'media' && !attribute.isMedia) {
				this.curStream = null;
				this.curAttribute = null;
			}
		},
		listenPubMsg(event) {
			const {name, data} = event;
			if (name === 'ShowPage' && this.curStream) {
				const {fileid, currpage} = data.filedata;
				if (this.curAttribute.fileid !== fileid) {
					this.roomClient.removeInjectStreamUrl(this.curAttribute.url);
				} else if (this.curAttribute.fileid === fileid && this.curAttribute.currpage !== currpage) {
					this.roomClient.removeInjectStreamUrl(this.curAttribute.url);
				}
			}
		},
		listenDelMsg(event) {
			const {id} = event;
			if (id === "showWhiteboard" && this.curStream) {
				this.roomClient.removeInjectStreamUrl(this.curAttribute.url);
			}
		}
	}
};
</script>

<style scoped lang="stylus">
.whiteboard-video-container
	position absolute
	left 0
	top 0
	width 100%
	height 100%
</style>
