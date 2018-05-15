<template>
  <div>
    <label class="c-label">Where?</label>
    <input class="c-text-input" ref="loc" placeholder="Search Location"/>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'LocationSearch',
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



