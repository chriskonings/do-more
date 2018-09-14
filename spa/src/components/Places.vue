<template>
  <div class="c-my-finds">
    <ul class="c-my-finds__list">
      <PlaceCard
        v-for="(p, i) in places"
        :place="p"
        :users="p.users"
        :key="i"
        @panToPlace="highlight(p, p.id, i)"
        @loaded="imageLoaded(p.id)"
        @save="savePlace(p)"
        @trash="deletePlace(p, p.id)"
        :user="user"
        :loading="loadingImgs[p.id]"
        :identifier="i"
      />
    </ul>
    <button
      v-if="page >= 1 && !loading"
      @click.prevent="loadMore"
      class="c-btn"
    >
      Load More
    </button>
    <div v-if="page >= 1 && loading" class="spinner"></div>
  </div>
</template>

<script>
import axios from 'axios';
import PlaceCard from './PlaceCard';

export default {
  name: 'Places',
  props: [
    'places',
    'savePlace',
    'user',
    'page',
    'loading',
    'markers',
    'map',
    'infoWindow',
  ],
  data() {
    return {
      currentlyHighlighted: null,
      loadingImgs: {},
    };
  },
  methods: {
    highlight(p, id, idx) {
      if (this.currentlyHighlighted !== idx) {
        this.currentlyHighlighted = idx;
        this.markers.forEach((m) => {
          if (m.place.id === id) {
            this.infoWindow.el.open(this.map, m);
            this.infoWindow.content = p;
          }
        });
      }
    },
    async deletePlace(place, id) {
      try {
        const getKey = await axios.get('/placeKeyById', {
          params: {
            placeId: id,
          },
        });
        const key = getKey.data;
        this.$emit('deletePlace', place, key);
        return key;
      } catch (e) {
        console.log(e);
        return e;
      }
    },
    loadMore() {
      this.$emit('getPlaces');
    },
    imageLoaded(id) {
      this.$set(this.loadingImgs, id, false);
    },
  },
  watch: {
    places(list) {
      // loading animation
      const keys = Object.keys(this.loadingImgs);
      // eslint-disable-next-line
      list.map((p) => {
        if (!keys.includes(p.id)) {
          this.$set(this.loadingImgs, p.id, true);
        }
      });
    },
  },
  components: { PlaceCard },
};
</script>
