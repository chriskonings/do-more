/* eslint-disable */

import firebase from 'firebase';
import 'firebase/auth';

const config = require('../../config.js');

const firebaseApp = firebase.initializeApp({
  apiKey: config.keys.FIREBASE,
  authDomain: 'do-more-ecc5c.firebaseapp.com',
  databaseURL: 'https://do-more-ecc5c.firebaseio.com/',
  projectId: 'do-more-ecc5c',
  storageBucket: 'do-more-ecc5c.appspot.com',
  messagingSenderId: '669577878898',
});

export const db = firebaseApp.database();