// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueFire from 'vuefire';
import gm from 'google-maps';
import App from './App';
import router from './router';
import './firebase';
import './assets/styles/main.scss';

const config = require('../../config.js');

gm.KEY = config.keys.GOOGLEMAPS;
gm.LIBRARIES = ['places', 'geometry'];

Vue.use(VueFire);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
