// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import gm from 'google-maps';
import firebase from 'firebase/app';
import 'firebase/auth';
import App from './App';
import router from './router';
import './assets/styles/main.scss';

const config = require('../../config.js');

gm.KEY = config.keys.GOOGLEMAPS;
gm.LIBRARIES = ['places', 'geometry'];

firebase.initializeApp({
  apiKey: config.keys.FIREBASE,
  authDomain: 'do-more-ecc5c.firebaseapp.com',
  databaseURL: 'https://do-more-ecc5c.firebaseio.com',
  projectId: 'do-more-ecc5c',
  storageBucket: 'do-more-ecc5c.appspot.com',
  messagingSenderId: '669577878898',
});

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
