<template>
  <div class="c-my-finds">
    <div class="c-my-finds__title">
      <p>Popular places being shared</p>
    </div>
    <div v-if="loading" class="spinner"></div>
    <ul v-else class="c-my-finds__list">
      <PlaceCard
        v-for="(g, i) in sortedFinds"
        :key="i"
        @loaded="imageLoaded(g.place.id)"
        @save="savePlace(g)"
        @trash="deletePlace(g, g['.key'])"
        @panToPlace="panToPlace(g)"
        :user="user"
        :loading="loadingImgs[g.place.id]"
        :icon="g.place.image_url"
        :name="g.place.name"
        :city="g.place.city"
        :link="g.place.link"
        :country="g.place.country"
        :users="g.users"
        :identifier="i"
      />
    </ul>
  </div>
</template>

<script>
import { db } from '../firebase';
import PlaceCard from './PlaceCard';

export default {
  name: 'HotList',
  props: ['user', 'map', 'markers', 'infoWindow'],
  data() {
    return {
      loading: false,
      finds: [],
      loadingImgs: {},
    };
  },
  async mounted() {
    await this.getfinds();
  },
  methods: {
    async savePlace(p) {
      this.$emit('savePlace', p);
    },
    async getfinds() {
      this.loading = true;
      this.$bindAsArray('finds', db.ref('finds'), null, () => { this.loading = false; });
    },
    imageLoaded(id) {
      this.$set(this.loadingImgs, id, false);
    },
    async deletePlace(place, key) {
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
    },
    panToPlace(p) {
      this.$emit('panToPlace', p);
    },
  },
  watch: {
    finds(list) {
      const keys = Object.keys(this.loadingImgs);
      // eslint-disable-next-line
      list.map((g) => {
        if (!keys.includes(g.place.id)) {
          this.$set(this.loadingImgs, g.place.id, true);
        }
      });
    },
  },
  computed: {
    sortedFinds() {
      return this.finds.slice(0).sort((a, b) => {
        const aUsers = a.users ? Object.keys(a.users).length : 0;
        const bUsers = b.users ? Object.keys(b.users).length : 0;
        const value = (aUsers < bUsers) ? 1 : -1;
        return value;
      });
    },
  },
  components: {
    PlaceCard,
  },
};
</script>
