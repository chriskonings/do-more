<template>
  <div class="c-my-finds">
    <UserBadge :user="user"/>
    <ActivitySelect
      :initialValue="user.interests"
      @getActivities="updateInterests"
      :limit="3"
    />
    <div class="c-my-finds__title">
      <h2>Saved</h2>
    </div>
    <div v-if="!loading && Object.keys(finds).length <= 0" class="no-saves">
      <svg class="no-saves__icon" width="50" height="50" xmlns="http://www.w3.org/2000/svg"><g fill="#CECECE" fill-rule="nonzero"><path d="M49.587 9.241L40.759.414a1.416 1.416 0 0 0-1-.414H1.414A1.413 1.413 0 0 0 0 1.414v47.172A1.413 1.413 0 0 0 1.414 50h47.172A1.413 1.413 0 0 0 50 48.586V10.241c0-.375-.149-.734-.413-1zM6.63 5.98c0-.563.457-1.02 1.02-1.02h27.755c.563 0 1.02.457 1.02 1.02v13.504a1.02 1.02 0 0 1-1.02 1.02H7.65a1.02 1.02 0 0 1-1.02-1.02V5.979zm36.74 36.696c0 .694-.564 1.258-1.258 1.258H7.888a1.259 1.259 0 0 1-1.258-1.258v-16.65c0-.695.564-1.258 1.258-1.259h34.224c.694 0 1.257.564 1.258 1.258v16.65z"/><path d="M29.925 6.73h4.24v12.002h-4.24V6.73zM10.257 30.11h29.486v1.414H10.257V30.11zm0 7.066h29.486v1.413H10.257v-1.413z"/></g></svg>
      <h4>Nothing saved :(</h4>
    </div>
    <div v-if="loading" class="spinner"></div>
    <ul v-else class="c-my-finds__list">
      <PlaceCard
        v-for="(g, k) in finds"
        :key="k"
        @loaded="imageLoaded(k)"
        @trash="deletePlace(g, k)"
        @panToPlace="panToPlace(g)"
        :user="user"
        :loading="loadingImgs[k]"
        :place="g.place"
        :users="g.users"
        :identifier="k"
      />
    </ul>
  </div>
</template>

<script>
import UserBadge from './UserBadge';
import PlaceCard from './PlaceCard';
import ActivitySelect from './ActivitySelect';
import { db } from '../firebase';
import { UserMixins } from './mixins/UserMixins';

export default {
  name: 'Myfinds',
  props: ['markers', 'map', 'infoWindow'],
  mixins: [UserMixins],
  data() {
    return {
      loading: false,
      deleting: null,
      loadingImgs: {},
      finds: {},
    };
  },
  async mounted() {
    await this.getfinds();
  },
  methods: {
    async getfinds() {
      this.loading = true;
      const keys = Object.keys(this.user.saved);
      const array = keys.filter(key => this.user.saved[key]);
      const promises = array.map(key =>
        db.ref(`finds/${key}`).once('value').then((snap) => {
          if (snap.val()) {
            this.finds[key] = snap.val();
            this.$set(this.loadingImgs, key, true);
          }
        }),
      );
      Promise.all(promises).then(() => {
        this.loading = false;
      });
    },
    deletePlace(place, key) {
      db.ref(`finds/${key}`)
        .child('users')
        .child(this.user.uid).remove()
        .then(() => {
          console.log('Remove succeeded.');
        })
        .catch((error) => {
          console.log('Remove failed: ', error.message);
        });
      db.ref(`users/${this.user.uid}`)
        .child(`saved/${key}`)
        .set(false)
        .then(() => {
          console.log('Remove succeeded.');
        })
        .catch((error) => {
          console.log('Remove failed: ', error.message);
        });
      this.$delete(place.users, this.user.uid);
      this.$set(this.user.saved, key, false);
      const m = this.$utils.newMarker(
        place,
        place.users,
        this.map,
        this.infoWindow,
        this.markers,
      );
      this.$emit('createMarker', m);
      this.$delete(this.finds, key);
    },
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
  },
  components: { UserBadge, PlaceCard, ActivitySelect },
};
</script>
<style lang="scss" scoped>
  .no-saves {
    display: flex;
    margin: 3rem auto;
    justify-content: center;
    flex-flow: column;
    align-items: center;
  }

  .no-saves__icon {
    opacity: .6;
  }
</style>
