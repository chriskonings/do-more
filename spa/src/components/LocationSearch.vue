<template>
  <div>
    <span v-show="invalidPlace">Click to search</span>
    <input class="c-text-input" ref="loc" placeholder="Search Location" type="text"/>
  </div>
</template>

<script>
export default {
  name: 'LocationSearch',
  props: ['map', 'places', 'google'],
  data() {
    return {
      invalidPlace: false,
    };
  },
  mounted() {
    this.initLocationSearch();
  },
  methods: {
    initLocationSearch() {
      const google = this.google;
      const input = this.$refs.loc;
      const autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          if (place.types.includes('establishment')) {
            console.log(place);
          }
          this.invalidPlace = false;
          const panPoint = new google.maps.LatLng(
            place.geometry.location.lat(),
            place.geometry.location.lng(),
          );
          this.map.panTo(panPoint);
        } else {
          this.invalidPlace = true;
        }
      });
    },
  },
};
</script>
