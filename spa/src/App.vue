<template>
  <div class="o-app" id="app">
    <router-view :google="googleMaps"/>
  </div>
</template>

<script>
import gm from 'google-maps';
const config = require('../../config.js');
gm.KEY = config.keys.GOOGLEMAPS;
gm.LIBRARIES = ['places', 'geometry'];

export default {
  name: 'App',
  data() {
    return {
      googleMaps: gm,
    };
  },
};
</script>
