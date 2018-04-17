<template>
  <div class="google-maps">
    <button class="google-maps__loc" @click="getLocation">Use location</button>
    <button class="google-maps__loc" @click="whereToGo">Where should I be?</button>
    <div class="google-maps__map" ref="map"></div>
    <div>{{errors}}</div>
  </div>
</template>

<script>
/* eslint-disable */

import utils from './utils'

export default {
  name: 'GoogleMaps',
  props: ['gMapsLoader', 'selected', 'emitMap', 'markers'],
  data() {
    return {
      position: { lat: 0, lng: 0 },
      map: null,
      currentPlace: null,
      errors: [],
    };
  },
  mounted() {
    this.initMap()
  },
  methods: {
    initMap() {
      this.gMapsLoader.load((google) => {
        this.map = new google.maps.Map(this.$refs.map, {
          zoom: 17,
          center: this.position
        })
        this.yourPin = new google.maps.Marker({icon: utils.pinSymbol('green')})
      })
    },
    getLocation () {
      if (navigator.geolocation) {
        var options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        };
        navigator.geolocation.getCurrentPosition((pos) => {
          var crd = pos.coords;
          var panPoint = new google.maps.LatLng(crd.latitude, crd.longitude);
          this.map.panTo(panPoint)
        }, (err) => {
          console.warn(`ERROR(${err.code}): ${err.message}`);
        }, options);
      }
    },
    whereToGo () {
      console.log(this.markers)
      const markerPositions = this.markers.map(mark => [mark.position.lat(), mark.position.lng()])
      const yourPlace = utils.calcPrimeLocation(markerPositions)
      if (yourPlace) {
        this.yourPin.setPosition({lat: yourPlace[0], lng: yourPlace[1]});
        this.yourPin.setMap(this.map);
      } else {
        this.yourPin.setMap(null);
      }
    },
  },
  watch: {
    map() {
      this.$emit('emitMap', this.map)
    }
  }
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




