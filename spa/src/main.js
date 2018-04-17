// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import VueFire from 'vuefire';
import firebase from 'firebase/app';
import 'firebase/firestore';
import Vue from 'vue';
import App from './App';
import router from './router';

Vue.config.productionTip = false;

Vue.use(VueFire);

firebase.initializeApp({
  projectId: 'do-more-ecc5c',
  databaseURL: 'https://do-more-ecc5c.firebaseio.com',
});
// eslint-disable-next-line
export const db = firebase.firestore();

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
