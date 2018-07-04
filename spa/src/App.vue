<template>
  <div class="o-app" id="app">
    <router-view :googleMaps="googleMaps"/>
  </div>
</template>

<script>
const config = require('../../config.js');
gm.KEY = config.keys.GOOGLEMAPS;
gm.LIBRARIES = ['places', 'geometry'];

export default {
  name: 'App',
  data() {
    return {
      googleMaps: null,
    };
  },
  created() {
    gm.load((google) => {
      this.googleMaps = google.maps
    });
  }
};
</script>
