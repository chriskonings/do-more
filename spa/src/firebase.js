import firebase from 'firebase';
import 'firebase/auth';

const firebaseApp = firebase.initializeApp({
  apiKey: FIREBASE_KEY,
  authDomain: "do-more-ecc5c.firebaseapp.com",
  databaseURL: "https://do-more-ecc5c.firebaseio.com",
  projectId: "do-more-ecc5c",
  storageBucket: "do-more-ecc5c.appspot.com",
  messagingSenderId: "669577878898"
});

// eslint-disable-next-line
export const db = firebaseApp.database();
