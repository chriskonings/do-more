<template>
  <div class="c-info-window">
    <template v-if="place">
      <img class="c-info-window__img" :src="place.image_url" alt="place-photo"/>
      <b class="c-info-window__title">{{place.name}}</b>
      <ul class="c-info-window__links">
        <li class="c-info-window__link">
          <a class="c-btn c-btn--link" :href="place.url" target="_blank">
            Link
          </a>
        </li>
        <li class="c-info-window__link">
          <button class="c-btn c-btn--link" @click.prevent="addToItinerary(place)">
            Add to itinerary
          </button>
        </li>
      </ul>
    </template>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'Itinerary',
  props: ['place', 'addToItinerary'],
};
</script>
<style lang="scss" scoped>
  .iw {
    max-width: 10rem;
  }
</style>





