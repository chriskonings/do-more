// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueFire from 'vuefire';
import App from './App';
import router from './router';
import './firebase';
import './assets/styles/main.scss';
import utils from './utils';

const plugin = {
  install() {
    Vue.utils = utils;
    Vue.prototype.$utils = utils;
  },
};

Vue.use(plugin);
Vue.use(VueFire);
Vue.config.productionTip = false;

// eslint-disable-next-line
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
