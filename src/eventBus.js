//各组件之间通讯使用
import Vue from 'vue';

export default new Vue({
	name: 'EventBus',
	data: {
		dashedBox: {
			status: 'nav',
			index: 0,
			isShow: false,
			navCount: 4,
			playerCount: null,
			libraryCount: 2
		},
		defaultDashedBox: {
			status: 'nav',
			index: 0,
			isShow: false,
			navCount: 4,
			playerCount: null,
			libraryCount: 2
		},
	},
	mounted() {

	},
	methods: {
		setDashedBox(dashedBox) {
			this.dashedBox = dashedBox;
		},
		getDashedBox() {
			return this.dashedBox;
		},
		resetDashedBox() {
			this.dashedBox = JSON.parse(JSON.stringify(this.defaultDashedBox));
		},
		showDashedBox() {
			this.dashedBox.isShow = true;
		},
		hideDashedBox() {
			/**关闭飞鼠 应该保留之前记录 不重置*/
			this.dashedBox.isShow = false;
		},
		getKeyNum(key) {
			switch (key) {
				case 65:
					return 'a';
				case 83:
					return 's';
				case 37:
					return 'left';
				case 38:
					return 'up';
				case 39:
					return 'right';
				case 40:
					return 'down';
				case 13:
					return 'enter';
				case 27:
					return 'esc';
				case 8:
					return 'backspace';
				case 49:
					return 1;
				case 50:
					return 2;
				case 51:
					return 3;
				case 52:
					return 4;
				case 53:
					return 5;
				case 54:
					return 6;
				case 55:
					return 7;
				case 56:
					return 8;
				case 57:
					return 9;
			}
		},
	}
});
