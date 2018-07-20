<template>
  <div class="c-user">
    <template v-if="user">
      <button
        @click.prevent="showUserMenu"
        class="c-user__details c-user__details--signed-in"
      >
        <div class="c-user__icon" :style="{ 'background-image': 'url(' + user.photoURL + ')' }">
        </div>
        <h2 class="c-user__name">
          {{user.displayName}}
        </h2>
      </button>
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
      <div class="c-user__details">
        <h2 class="c-user__name">
          Guest
        </h2>
        <span>Sign in to save places</span>
      </div>
      <button @click.prevent="signIn" class="c-btn c-btn--naked">
        Sign in
      </button>
    </template>
  </div>
</template>

<script>
import firebase from 'firebase/app';

export default {
  name: 'User',
  props: ['user'],
  data() {
    return {
      message: '',
    };
  },
  methods: {
    userSettings() {

    },
    signIn() {
      const provider = new firebase.auth.TwitterAuthProvider();
      firebase.auth().signInWithRedirect(provider);
    },
    signOut() {
      firebase.auth().signOut().then(() => {
        console.log('signed out');
      }).catch((error) => {
        console.log(error);
      });
    },
    showUserMenu() {
      this.$emit('showUserMenu');
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
