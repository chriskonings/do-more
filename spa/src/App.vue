<template>
  <div class="o-app" id="app">
    <router-view :google="google"/>
  </div>
</template>

<script>
gm.KEY = GOOGLEMAPS_KEY; // eslint-disable-line no-undef
gm.LIBRARIES = ['places', 'geometry']; // eslint-disable-line no-undef

export default {
  name: 'App',
  data() {
    return {
      google: null,
    };
  },
  created() {
    gm.load((google) => { // eslint-disable-line no-undef
      this.google = google;
    });
  },
};
</script>
