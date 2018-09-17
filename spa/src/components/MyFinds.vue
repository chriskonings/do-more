<template>
  <div class="c-my-finds">
    <ActivitySelect
      :initialValue="user.interests"
      @getActivities="updateInterests"
      :limit="3"
    />
    <div class="c-my-finds__title">
      <h2>Saved</h2>
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
import { db } from '../firebase';
import PlaceCard from './PlaceCard';
import ActivitySelect from './ActivitySelect';
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
      return this.$store.state.user
    },
  },
  components: { PlaceCard, ActivitySelect },
};
</script>
