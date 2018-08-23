<template>
  <div class="c-my-finds">
    <div class="c-my-finds__title">
      <p>Places you have discovered</p>
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
        :icon="g.place.image_url"
        :name="g.place.name"
        :city="g.place.city"
        :link="g.place.link"
        :country="g.place.country"
        :users="g.users"
        :identifier="k"
      />
    </ul>
  </div>
</template>

<script>
import { db } from '../firebase';
import PlaceCard from './PlaceCard';

export default {
  name: 'Myfinds',
  props: ['user', 'markers', 'map', 'infoWindow'],
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
        this.markers
      )
      this.$emit('createMarker', m)
      this.$delete(this.finds, key);
    },
    imageLoaded(key) {
      this.$set(this.loadingImgs, key, false);
    },
    panToPlace(p) {
      this.$emit('panToPlace', p);
    },
  },
  components: { PlaceCard },
};
</script>
