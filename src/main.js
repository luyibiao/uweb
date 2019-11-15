import Vue from 'vue'
import App from './App'
import router from './router'
import '@/utils/init'
import filters from './utils/filters'
import store from '@/store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/theme/less/variable.less'
import '@/theme/css/main.css'
import '@/theme/css/svg.css'
import '@/theme/css/common.css'
import auth from '@/components/Auth'
Vue.config.productionTip = true;

Vue.use(ElementUI);
Vue.use(filters);
Vue.component('auth', auth);

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
  // template: '<App/>',
  // components: {App}
});
