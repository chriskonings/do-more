<template>
  <div>
    <gmap-map
      :center="center"
      :zoom="10"
      style="width: 100%; height: 300px"
    />
    <GmapAutocomplete @place_changed="setPlace" />
    <button @click="getLocation()">Current</button>
  </div>
</template>

<script>
import * as VueGoogleMaps from 'vue2-google-maps';
import Vue from 'vue';

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCS0KrhCnNOyW__KqWeeN-ZCC0ZuQNd3m4',
    libraries: 'places',
  },
});

export default {
  name: 'Gmap',
  data() {
    return {
      center: { lat: 0, lng: 0 },
      position: {},
    };
  },
  methods: {
    setPlace(place) {
      if (place) {
        this.center.lat = place.geometry.location.lat();
        this.center.lng = place.geometry.location.lng();
      }
    },
    getLocation() {
      // eslint-disable-next-line
      this.geoLocation()
    },
    geoLocation() {
      const positionOption = { timeout: 500, enableHighAccuracy: true };
      const gpsSunccuss = (currentPosition) => {
        // eslint-disable-next-line
        console.log(currentPosition)
      };
      const gpsFailed = (err) => {
        // eslint-disable-next-line
        console.log(err)
      };
      navigator.geolocation.getCurrentPosition(gpsSunccuss, gpsFailed, positionOption);
    },
  },
};
</script>
