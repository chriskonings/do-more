<template>
  <div>
    <gmap-map
      :center="center"
      :zoom="12"
      style="width: 100%; height: 300px"
    />
    <GmapAutocomplete @place_changed="setPlace"/>
    <button @click="getLocation()">Geolocation</button>
    <PlaceSearch />
  </div>
</template>

<script>

import * as VueGoogleMaps from 'vue2-google-maps';
import Vue from 'vue';
import PlaceSearch from './PlaceSearch';

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
  mounted() {
    // eslint-disable-next-line
    console.log(VueGoogleMaps)
  },
  methods: {
    setPlace(place) {
      // eslint-disable-next-line
      console.log(place)
      if (place) {
        this.center.lat = place.geometry.location.lat();
        this.center.lng = place.geometry.location.lng();
      }
    },
    getLocation() {
      this.geoLocation();
    },
    geoLocation() {
      const positionOption = { timeout: 10000, enableHighAccuracy: true };
      const gpsSunccuss = (pos) => {
        // eslint-disable-next-line
        console.log(pos)
        this.center = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
      };
      const gpsFailed = (err) => {
        // eslint-disable-next-line
        console.log(err)
      };
      navigator.geolocation.getCurrentPosition(gpsSunccuss, gpsFailed, positionOption);
    },
  },
  components: { PlaceSearch },
};
</script>
