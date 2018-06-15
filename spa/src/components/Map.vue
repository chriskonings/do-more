<template>
  <div class="c-map">
    <div class="c-map__btns">
      <button class="c-map__location-btn" @click="getLocation">
        <svg class="c-map__location-btn-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="38" height="37" viewBox="0 0 44 34"><defs><filter id="a" width="128%" height="128%" x="-14%" filterUnits="objectBoundingBox"><feOffset dy="2" in="SourceAlpha" result="shadowOffsetOuter1"/><feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="2"/><feColorMatrix in="shadowBlurOuter1" result="shadowMatrixOuter1" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"/><feMerge><feMergeNode in="shadowMatrixOuter1"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><path fill="#EFEFEF" fill-rule="evenodd" d="M6.67 25.25l30.45-13.58-15.23 30.35-2.61-13.71z" filter="url(#a)" transform="translate(-3 -10)"/></svg>
      </button>
      <!-- <button class="c-map__btn" @click="whereToGo">Where should I be?</button> -->
    </div>
    <div class="c-map__canvas" ref="map"></div>
  </div>
</template>

<script>
/* eslint-disable */

import utils from './utils'

export default {
  name: 'Map',
  props: ['gMapsLoader', 'selected', 'emitMap', 'markers', 'infoWindow'],
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
    this.getLocation()
  },
  methods: {
    initMap() {
      const vm = this
      this.gMapsLoader.load((google) => {
        vm.map = new google.maps.Map(this.$refs.map, {
          zoom: 17,
          center: this.position,
          mapTypeControl: false,
        })
        const service = new google.maps.places.PlacesService(vm.map);
        google.maps.event.addListener(vm.map, 'click', function(event) {
          if (event.placeId) {
            event.stop();
            service.getDetails({placeId: event.placeId}, function(place, status) {
              var marker = new google.maps.Marker({
                position: {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()},
                map: vm.map,
                title: place.name,
                visible: false,
              });
              vm.infoWindow.el.open(vm.map, marker);
              if (status === 'OK') {
                vm.infoWindow.content = {
                  name: place.name,
                  phone: place.formatted_phone_number,
                  place: place,
                  url: place.url,
                  image_url: typeof place.photos !== 'undefined'
                      ? place.photos[0].getUrl({'maxWidth': 100, 'maxHeight': 100})
                      : ''
                }
              }
            });
          }
        });
        this.yourPin = new google.maps.Marker({icon: utils.pinSymbol('green')})
      })
    },
    getLocation () {
      if (navigator.geolocation) {
        const options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        };
        navigator.geolocation.getCurrentPosition((pos) => {
          const crd = pos.coords;
          const panPoint = new google.maps.LatLng(crd.latitude, crd.longitude);
          this.map.panTo(panPoint)
        }, (err) => {
          console.warn(`ERROR(${err.code}): ${err.message}`);
        }, options);
      }
    },
    whereToGo () {
      const markerPositions = this.markers.map(mark => [mark.position.lat(), mark.position.lng()])
      const yourPlace = utils.calcPrimeLocation(markerPositions)
      if (yourPlace) {
        const panPoint = new google.maps.LatLng(yourPlace[0], yourPlace[1]);
        this.yourPin.setPosition({lat: yourPlace[0], lng: yourPlace[1]});
        this.yourPin.setMap(this.map);
        this.map.panTo(panPoint)
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



