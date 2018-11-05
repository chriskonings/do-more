<template>
  <div class="c-view-user">
    <div v-if="loading" class="spinner"></div>
    <div v-else>
      <UserBadge :user="viewingUser" :showInterests="true" />
      <PlaceCard
        v-if="f"
        v-for="(f, k) in finds"
        :key="k"
        @loaded="imageLoaded(k)"
        @panToPlace="panToPlace(f)"
        :user="user"
        :loading="loadingImgs[k]"
        :place="f.place"
        :users="f.users"
        :identifier="k"
      />
    </div>
  </div>
</template>

<script>
import UserBadge from './UserBadge';
import PlaceCard from './PlaceCard';
import { UserMixins } from './mixins/UserMixins';

export default {
  name: 'ViewUser',
  props: [],
  mixins: [UserMixins],
  data() {
    return {
      loading: true,
      finds: {},
      loadingImgs: {},
    };
  },
  mounted() {
    const promises = Object.keys(this.user.saved).map((key) => {
      if (this.user.saved[key]) {
        this.$set(this.loadingImgs, key, true);
        return this.getSavedById(key);
      }
      return null;
    });
    Promise.all(promises).then((values) => {
      this.finds = values;
      this.loading = false;
    });
  },
  methods: {
    imageLoaded(key) {
      this.$set(this.loadingImgs, key, false);
    },
    panToPlace(p) {
      this.$emit('panToPlace', p);
    },
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    viewingUser() {
      return this.$store.state.viewingUser;
    },
  },
  components: { UserBadge, PlaceCard },
};
</script>
<style lang="scss" scoped>
  .c-view-user {
    display: flex;
  }
</style>
