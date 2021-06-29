<template>
	<div class="trophy-animation">
		<transition-group @before-enter="trophyBeforeEnterAnimation" @enter="trophyEnterAnimation"
						  @after-enter="trophyAfterEnterAnimation">
			<template v-for="(trophyItem,trophyIndex) in trophies">
				<img v-if="trophyItem.isShow" class="trophy-icon" :id="'trophyItem_'+trophyIndex" :key="trophyIndex"
					 :src="trophyItem.icon"
					 :alt="trophyItem.name"/>
			</template>
		</transition-group>
	</div>
</template>

<script>
	import EventBus from '../../eventBus';
	import Room from "../../models/room/Room";
	import {mapState} from 'vuex';
	import RoomController from "../../controllers/RoomController";
	export default {
		name: "TrophyAnimation",
		data() {
			return {
				trophies: [],
				trophyIndex: null
			};
		},
		mounted() {
			EventBus.$on('trophy', data => {
				if (!data) return;
				this.createTrophy(data);
			});
		},
		computed: {
			...mapState({
				// roomId: state => state.roomObject.id,
				layouts: 'studentLayouts',
				currLayoutType: 'currLayoutType'
			}),
			...mapState('Student/', {
				students: "items"
			})
		},
		methods: {
			trophyBeforeEnterAnimation(el) {
				el.style = `transform: translate(-50%,-50%) scale(0);`;
			},
			trophyEnterAnimation(el, done) {
				let trophyItem = this.trophies[this.trophyIndex],
					studentIndex = this.students.findIndex(item => item.uid === trophyItem.user_id),
					layoutItem = this.layouts[studentIndex];
				setTimeout(() => el.style = `transform: translate(-50%,-50%) scale(1);`, 50);
				setTimeout(() => {
					el.style = `transform:translate(-50%,-50%) scale(0); left:${layoutItem.x + layoutItem.width / 2}px;
                    top:${layoutItem.y + layoutItem.height / 2}px;`;
				}, 1000);
				setTimeout(() => done(), 2000);
			},
			trophyAfterEnterAnimation() {
				let trophyItem = this.trophies[this.trophyIndex];
				this.trophies.map(item => {
					if (item.trophy_id === trophyItem.trophy_id) item.isShow = false;
				});
			},
			createTrophy(data) {
				data.isShow = true;
				this.trophies.push(data); //累计执行动画的奖杯
				this.trophyIndex = this.trophies.length - 1; //当前执行动画的奖杯
				let {user_id: userId, trophy_id: trophyId} = data,
					currUser = this.students.find(item => item.uid === userId);
				/** 2秒后隐藏动画 并更改奖杯属性*/
				setTimeout(() => {
					currUser.trophyCount++; //飞行结束 当前学生奖杯+1
					RoomController.sendSignalingMessage('showTrophy', {user_id: userId}, 'delete');
					// //发送更改奖杯后的属性
					let UserPropertyOptions = {
						trophyCount: currUser.trophyCount
					};
					RoomController.setProperties(userId, UserPropertyOptions);
				}, 2000);
				/**发送服务器 增加奖杯数量*/
				// if (userId.includes('user_')) {
				// 	const studentId = Number(userId.replace('user_', ''));
				// 	RoomTrophyService.store(this.roomId, studentId, trophyId);
				// }
			}
		},
		destroyed() {
			EventBus.$off('trophy');
		}
	};
</script>

<style scoped lang="stylus">
	.trophy-animation
		.trophy-icon
			position fixed
			left 50%
			top 50%
			width 60%
			transform translate(-50, -50%) scale(0)
			transition all 2s
			object-fit cover
			z-index 50

</style>
