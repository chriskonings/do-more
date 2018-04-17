<template>
  <div class="google-maps">
    <label>Location</label>
    <input class="google-maps__search" ref="loc" placeholder="Search Location"/>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'placeSearch',
  props: ['gMapsLoader', 'map'],
  mounted() {
    this.initLocationSearch();
  },
  methods: {
    initLocationSearch() {
      this.gMapsLoader.load((google) => {
        const input = this.$refs.loc;
        var autocomplete = new google.maps.places.Autocomplete(input);
        // autocomplete.setTypes(['regions'])
        autocomplete.addListener('place_changed', (place) => {
          var place = autocomplete.getPlace();
          var panPoint = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng());
          this.map.panTo(panPoint)
        });
      })
    }
  },
};
</script>
<style>
  .google-maps__map {
    height: 50rem;
    width: 100%;
    display: block;
    margin: 2rem auto;
  }
</style>




