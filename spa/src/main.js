// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex'
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

Vue.use(Vuex)
Vue.use(plugin);
Vue.use(VueFire);
Vue.config.productionTip = false;

const store = new Vuex.Store({
  state: {
    user: {
      uid: null,
      displayName: 'Guest',
      photoURL: null,
      interests: [],
      saved: {},
    },
    intro: true
  },
  mutations: {
    updateUser (state, update) {
      state.user = update
    },
    setIntro (state, bool) {
      console.log(bool)
      state.intro = bool
    },
  }
})

// eslint-disable-next-line
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
});
