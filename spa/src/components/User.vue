<template>
  <div class="c-user">
    <template v-if="user">
      <div class="c-user__icon" :style="{ 'background-image': 'url(' + user.photoURL + ')' }">
      </div>
      <h2 class="c-user__name">
        {{user.displayName}}
      </h2>
      <button @click.prevent="signOut" class="c-btn c-btn--naked">
        Sign out
      </button>
      <!-- <ul>
        <li>
          <a @click.prevent="update" class="c-btn c-btn--link">
            Update
          </a>
        </li>
      </ul> -->
    </template>
    <template v-else>
      <h2 class="c-user__name">
        You're not signed in.
      </h2>
      <button @click.prevent="signIn" class="c-btn c-btn--naked">
        Sign in
      </button>
    </template>
  </div>
</template>

<script>
import firebase from 'firebase/app';

/* eslint-disable */
export default {
  name: 'User',
  props: ['user'],
  data() {
    return {
      message: '',
    }
  },
  methods: {
    userSettings() {

    },
    signIn() {
      const provider = new firebase.auth.TwitterAuthProvider();
      firebase.auth().signInWithRedirect(provider);
    },
    signOut() {
      firebase.auth().signOut().then(function() {
        console.log('signed out')
      }).catch(function(error) {
        console.log(error)
      });
    },
    // update() {
    //   const vm = this
    //   this.user.updateProfile({
    //     displayName: "Chris Konings",
    //   }).then(function() {
    //     console.log('successfully logged in')
    //   }).catch(function(error) {
    //     console.log(error)
    //   });
    // }
  },
};
</script>
