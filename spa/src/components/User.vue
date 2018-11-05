<template>
  <div class="c-user" :class="{'c-user__loading': loading, 'c-user__active': active}">
    <div v-if="loading" class="spinner"></div>
    <template v-else>
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
      <button v-if="user.uid" @click.prevent="signOut" class="c-btn c-btn--naked">
        Sign out
      </button>
      <button v-else @click.prevent="signIn" class="c-btn c-btn--naked">
        Sign in
      </button>
    </template>
  </div>
</template>

<script>
import { UserMixins } from './mixins/UserMixins';

export default {
  name: 'User',
  props: ['loading', 'active'],
  mixins: [UserMixins],
  data() {
    return {
      message: '',
    };
  },
  methods: {
    showUserMenu() {
      this.$emit('showUserMenu');
    },
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
};
</script>
