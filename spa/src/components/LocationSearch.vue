<template>
  <div>
    <!-- <label class="c-label">Search</label> -->
    <span v-show="invalidPlace">Click to search</span>
    <input class="c-text-input" ref="loc" placeholder="Search Location"/>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'LocationSearch',
  props: ['gMapsLoader', 'map'],
  data() {
    return {
      invalidPlace: false
    }
  },
  mounted() {
    this.initLocationSearch();
  },
  methods: {
    initLocationSearch() {
      this.gMapsLoader.load((google) => {
        const input = this.$refs.loc;
        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.addListener('place_changed', () => {
          var place = autocomplete.getPlace();
          if (place.geometry) {
            this.invalidPlace = false
            var panPoint = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng());
            this.map.panTo(panPoint)
          } else {
            this.invalidPlace = true
          }
        });
      })
    }
  },
};
</script>



