<template>
  <div class="o-app" id="app">
    <router-view :googleMaps="googleMaps"/>
  </div>
</template>

<script>
gm.KEY = GOOGLEMAPS_KEY; // eslint-disable-line no-undef
gm.LIBRARIES = ['places', 'geometry']; // eslint-disable-line no-undef

export default {
  name: 'App',
  data() {
    return {
      googleMaps: null,
    };
  },
  created() {
    gm.load((google) => { // eslint-disable-line no-undef
      this.googleMaps = google.maps;
    });
  },
};
</script>
