<template>
  <div>
    <label>Limit</label>
    <input id="number" type="number" v-model="limit">
    <select v-model="sortBy">
      <option value="distance">Distance</option>
      <option value="best_match">Best Match</option>
      <option value="rating">Rating</option>
      <option value="review_count">Review Count</option>
    </select>
    <label>Find places</label>
    <button
      :disabled="searching"
      @click="searchSelected"
    >
      Search
    </button>
    <InfoWindow
      ref="info"
      :place="iw"
      :addToItinerary="addToItinerary"
    />
  </div>
</template>

<script>
/* eslint-disable */
import utils from './utils'
import axios from 'axios'
import InfoWindow from './InfoWindow'

function sortThenLimit (arr, limit) {
  const sort = arr.sort(function (a, b) {
    return b.rating - a.rating;
  });
  return sort.slice(0, limit)
}

export default {
  name: 'FindPlaces',
  props: ['gMapsLoader', 'map', 'selected'],
  data() {
    return {
      markers: [],
      searching: false,
      places: null,
      iw: {},
      limit: 2,
      radius: 0,
      sortBy: 'best_match'
    };
  },

  methods: {
    addToItinerary (place) {
      this.$emit('emitPlaces', place)
    },
    async clearMarkers(markers) {
      const vm = this
      return new Promise(function (success, reject){
        for (let i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
        vm.markers = [];
        success()
      });
    },
    async searchSelected() {
      this.searching = true
      await this.clearMarkers(this.markers);
      const fullResults = await this.buildList()
      await this.placeYelpMarkers(fullResults)
    },
    async buildList () {
      const lastStatus = null;
      const list = [];
      const radius = await this.getMapRadius()
      if (this.selected.length > 0) {
        for (let i = 0; i < this.selected.length; i++) {
          const places = await this.getYelpPlaces(this.selected[i], this.limit, radius, this.sortBy);
          list.push(...places);
        }
        this.searching = false
        return list;
      } else {
        this.searching = false;
        console.log('nothing selected');
      }
    },
    async getYelpPlaces (term, limit, radius, sortBy) {
      const mapLat = await this.map.center.lat();
      const mapLng = await this.map.center.lng();
      try {
        const response = await axios.get(`/api`, {
          params: {
            lat: mapLat,
            lng: mapLng,
            limit: limit,
            term: term,
            radius: radius,
            sortBy: sortBy
          }
        })
        const list = response.data
        return list
      } catch (e) {
        console.log(e)
      }
    },
    async placeYelpMarkers(list) {
      const vm = this
      this.gMapsLoader.load((google) => {
        for (let i = 0; i < list.length; i++) {
          vm.markers[i] = new google.maps.Marker({
            position: {lat: list[i].coordinates.latitude, lng: list[i].coordinates.longitude},
            icon: utils.pinSymbol('red')
          });
          vm.markers[i].placeResult = list[i];
          google.maps.event.addListener(vm.markers[i], 'click', function() {
            vm.infoWindow.open(vm.map, this);
            vm.iw = list[i]
          });
          vm.markers[i].setMap(vm.map);
        }
      })
      if (this.markers.length >= 1) {
        this.panMap(google);
      }
    },
    panMap (google) {
      const bounds = new google.maps.LatLngBounds();
      for (var i = 0; i < this.markers.length; i++) {
        bounds.extend(this.markers[i].getPosition());
      }
      this.map.fitBounds(bounds);
    },
    async getMapRadius () {
      let radius;
      this.gMapsLoader.load((google) => {
        const bounds = this.map.getBounds();
        const center = this.map.getCenter();
        if (bounds && center) {
          const ne = bounds.getNorthEast();
          radius = google.maps.geometry.spherical.computeDistanceBetween(center, ne);
        }
      })
      return Math.floor(radius);
    },
    updateSearchMap () {
      this.gMapsLoader.load((google) => {
        this.places = new google.maps.places.PlacesService(this.map);
        console.log(this.$refs.info.$el)
        this.infoWindow = new google.maps.InfoWindow({
          content: this.$refs.info.$el
        });
      })
    },
  },
  watch: {
    markers(){
      this.$emit('emitMarkers', this.markers)
    },
    map() {
      this.updateSearchMap()
    }
  },
  components: {InfoWindow}
};
</script>
<style lang="scss" scoped>
 .iw {
   max-width: 15rem;
 }
</style>



