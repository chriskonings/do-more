<template>
  <div class="iw">
    <table v-if="place">
      <tr id="iw-url-row" class="iw_table_row">
        <td id="iw-name">
        {{place.name}}
        </td>
      </tr>
      <tr id="iw-phone-row" class="iw_table_row">
        <td id="iw-phone">{{place.phone}}</td>
      </tr>
      <tr id="iw-url-row" class="iw_table_row">
        <td id="iw-url">
          <a :href="place.url" target="_blank">Yelp link</a>
        </td>
        <td id="iw-link">
          <button @click.prevent="addToItinerary(place)">Add to itinerary</button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'Itinerary',
  props: ['place', 'addToItinerary'],
  mounted() {

  },
  methods: {

  },
};
</script>
<style lang="scss" scoped>

</style>





