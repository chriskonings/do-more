<template>
  <div class="c-user-badge">
    <div
      class="c-user-badge__icon c-user-badge__icon--lg"
      :title="user.displayName"
      :style="{ 'background-image': 'url(' + user.photoURL + ')' }">
    </div>
    <h2 class="c-user-badge__name">{{user.displayName}}</h2>
    <h3 class="c-user-badge__save-count">Saved: {{userSavedCount}}</h3>
    <div v-if="showInterests" class="c-user-badge__interests">Interests:
      <span v-for="(int, idx) in user.interests">
        {{int.title}}<span v-if="idx != user.interests.length - 1">, </span>
      </span>
    </div>
  </div>
</template>

<script>

export default {
  name: 'UserBadge',
  props: ['user', 'showInterests'],
  mixins: [],
  data() {
    return {

    };
  },
  mounted() {
  },
  methods: {

  },
  computed: {
    userSavedCount() {
      return Object.keys(this.user).length
    },
  },
  components: { }
};
</script>
<style lang="scss" scoped>
  .c-user-badge {
    text-align: center;
  }
  .c-user-badge__name {
    margin: .5rem;
  }
  .c-user-badge__save-count {
    margin: .5rem;
  }
  .c-user-badge__icon {
    display: inline-block;
    width: 8rem;
    height: 8rem;
    margin: .2rem;
    background-position: center;
    background-size: cover;
    border-radius: 50%;
    transition: .3s ease;
    &:hover {
      zoom: 1.1;
      opacity: .7;
    }
  }
</style>
