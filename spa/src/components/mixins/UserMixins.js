import firebase from 'firebase/app';
import { db } from '../../firebase';

export const UserMixins = {
  // data() {
  //   return {
  //     isShowing: false
  //   }
  // },
  methods: {
    signIn() {
      console.log('sign in')
      const provider = new firebase.auth.TwitterAuthProvider();
      firebase.auth().signInWithRedirect(provider);
    },
    signOut() {
      firebase.auth().signOut().then(() => {
        console.log('signed out');
        this.$store.commit('setIntro', true);
        this.$store.commit('updateUser', {
          uid: null,
          displayName: 'Guest',
          photoURL: null,
          interests: [],
          saved: {},
        })
      }).catch((error) => {
        console.log(error);
      });
    },
    updateInterests(interests) {
      if (this.user.uid) {
        this.$set(this.user, 'interests', interests);
        db.ref(`users/${this.user.uid}`).child(`interests`).set(interests);
      } else {
        this.$set(this.user, 'interests', interests);
      }
    },
    getUserById(uid) {
      return db.ref(`users/${uid}`).once('value').then((snap) => {
        const user = snap.val();
        return user
      }).catch((e) => {
        return e
      })
    },
    getSavedById(key) {
      return db.ref(`finds/${key}`).once('value').then((snap) => {
        const place = snap.val();
        return place
      }).catch((e) => {
        return e
      })
    }
  }
}
