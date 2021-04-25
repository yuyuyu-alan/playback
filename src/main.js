import Vue from 'vue'
import App from './App.vue'
import store from './store';
import router from './router'
import moment from 'moment';
import ElementUI from 'element-ui';
import './assets/theme/index.css';
import Config from './config';
import './filter';
import 'resetcss';
Vue.use(ElementUI);

Vue.config.productionTip = false
Vue.config.productionTip = false;
Vue.prototype.$config = Config;
Vue.prototype.moment = moment;
new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
