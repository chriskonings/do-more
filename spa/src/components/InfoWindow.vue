<template>
  <div class="c-info-window">
    <template v-if="place">
      <div
        class="c-info-window__img-container"
        :class="{'is-loading': loading}"
      >
        <img
          v-show="!loading"
          class="c-info-window__img"
          :src="place.image_url"
          @load="loading = false"
          alt="place-photo"/>
      </div>
      <b class="c-info-window__title">{{place.name}}</b>
      <div class="c-info-window__shares">
        Shared by:
        <div v-if="place.users" v-for="(u, i) in place.users" :key="i">
          {{u.displayName}}
        </div>
      </div>
      <ul class="c-info-window__links">
        <li class="c-info-window__link">
          <a class="c-btn c-btn--naked" :href="place.url" target="_blank">
            Link
          </a>
        </li>
        <li class="c-info-window__link">
          <button class="c-btn c-btn--naked" @click.prevent="savePlace(place)">
            Save
          </button>
        </li>
      </ul>
    </template>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'InfoWindow',
  props: ['place', 'savePlace', 'itineraries'],
  data() {
    return {
      itinerary: null,
      loading: true,
    }
  },
  computed: {
    id() {
      if (this.place) return this.place.id
    }
  },
  watch: {
    itineraries() {
      if (this.itineraries.length) {
        this.itinerary = this.itineraries[0]['.key']
      }
    },
    id() {
      this.loading = true
    }
  }
};
</script>
<style lang="scss" scoped>
  .iw {
    max-width: 10rem;
  }
</style>





