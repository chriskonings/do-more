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
        @save="savePlace(g)"
        @trash="deletePlace(k)"
        :user="user"
        :loading="loadingImgs[k]"
        :icon="g.place.image_url"
        :name="g.place.name"
        :city="g.place.city"
        :link="g.place.link"
        :country="g.place.country"
        :users="g.users"
        :identifier="k"
        :trashable="true"
      />
    </ul>
  </div>
</template>

<script>
import { db } from '../firebase';
import PlaceCard from './PlaceCard';

/* eslint-disable */
export default {
  name: 'Myfinds',
  props: ['user'],
  data() {
    return {
      loading: false,
      deleting: null,
      loadingImgs: {},
      finds: {}
    };
  },
  async mounted() {
    await this.getfinds()
  },
  methods: {
    async getfinds() {
      this.loading = true;
      const keys = Object.keys(this.user.saved)
      const array = keys.filter(key => this.user.saved[key])
      const promises = array.map(key => {
        return db.ref('finds/' + key).once('value').then((snap) => {
          if (snap.val()) {
            this.finds[key] = snap.val()
            this.$set(this.loadingImgs, key, true)
          }
        });
      });
      Promise.all(promises).then(p => {
        this.loading = false;
      });
    },
    deletePlace(key) {
      db.ref('finds/' + key)
        .child('users')
        .child(this.user.uid).remove()
        .then(() => {
          console.log('Remove succeeded.');
        })
        .catch((error) => {
          console.log('Remove failed: ', error.message);
        });
      db.ref('users/' + this.user.uid)
        .child('saved/' + key)
        .set(false)
        .then(() => {
          console.log('Remove succeeded.');
        })
        .catch((error) => {
          console.log('Remove failed: ', error.message);
        });
      this.$delete(this.finds, key)
      this.$set(this.user.saved, key, false)
    },
    imageLoaded(key) {
      this.$set(this.loadingImgs, key, false)
    },
  },
  components: {PlaceCard}
};
</script>



