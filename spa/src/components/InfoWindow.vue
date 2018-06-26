<template>
  <div class="c-info-window">
    <template v-if="place">
      <div
        class="c-info-window__img"
        :style="{ backgroundImage: 'url(' + place.image_url + ')' }"
        alt="place-photo">
      </div>
      <b class="c-info-window__title">{{place.name}}</b>
      <ul class="c-info-window__links">
        <li class="c-info-window__link">
          <a class="c-btn c-btn--naked" :href="place.url" target="_blank">
            Link
          </a>
        </li>
        <li class="c-info-window__link">
          <button class="c-btn c-btn--naked" @click.prevent="addToItinerary(place)">
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
  props: ['place', 'addToItinerary', 'itineraries'],
  data() {
    return {
      itinerary: null
    }
  },
  watch: {
    itineraries() {
      if (this.itineraries.length) {
        this.itinerary = this.itineraries[0]['.key']
      }
    }
  }
};
</script>
<style lang="scss" scoped>
  .iw {
    max-width: 10rem;
  }
</style>





