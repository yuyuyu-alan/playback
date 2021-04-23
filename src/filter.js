import Vue from 'vue';
import moment from "moment";

Vue.filter('fileType', function (value) {
	switch (value) {
		case 'image/jpeg':
			return 'jpg';
		case 'image/jpg':
			return 'jpg';
		case 'image/png':
			return 'png';
		case 'image/gif':
			return 'gif';
		case 'video/mp4':
			return 'mp4';
		case 'pdf':
			return 'pdf';
		default:
			return '未知';
	}
});

Vue.filter('toKBorMB', function (value) {
	return (value / 1024 / 1024) > 1 ? (value / 1024 / 1024).toFixed(2) + 'MB' : (value / 1024).toFixed(2) + 'KB';
});

Vue.filter('datetimeToDate', function (value) {
	return moment(value, 'YYYY-MM-DD HH:mm:ss').format('MM/DD');
});
Vue.filter('datetimeToTime', function (value) {
	return moment(value, 'YYYY-MM-DD HH:mm:ss').format('MM/DD');
});

