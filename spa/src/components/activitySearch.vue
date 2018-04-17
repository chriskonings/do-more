<template>
  <div class="google-maps">
    <label>Activity Search</label>
    <button
      :disabled="searching"
      class="google-maps__loc"
      @click="searchSelected"
    >
      Search
    </button>
    <button
      :disabled="searching"
      class="google-maps__loc"
      @click="testYelp"
    >
      Yelp Search
    </button>
    <div style="display: none">
      <div ref="info">
        <table>
          <tr id="iw-url-row" class="iw_table_row">
            <td id="iw-url">
              <a :href="iw.url" target="_blank">Find on Yelp</a>
            </td>
          </tr>
          <tr id="iw-url-row" class="iw_table_row">
            <td id="iw-url">
              {{iw.name}}
            </td>
          </tr>
          <tr id="iw-address-row" class="iw_table_row">
            <td class="iw_attribute_name">Address:</td>
            <td id="iw-address">{{iw.address}}</td>
          </tr>
          <tr id="iw-phone-row" class="iw_table_row">
            <td class="iw_attribute_name">Telephone:</td>
            <td id="iw-phone">{{iw.phone}}</td>
          </tr>
          <tr id="iw-rating-row" class="iw_table_row">
            <td class="iw_attribute_name">Rating:</td>
            <td id="iw-rating">{{iw.rating}}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import utils from './utils'
import axios from 'axios'

function sortThenLimit (arr, limit) {
  const sort = arr.sort(function (a, b) {
    return b.rating - a.rating;
  });
  return sort.slice(0, limit)
}

export default {
  name: 'ActivitySearch',
  props: ['gMapsLoader', 'map', 'selected', 'emitMarkers', 'limit'],
  data() {
    return {
      markers: [],
      searching: false,
      places: null,
      iw: {},
    };
  },

  methods: {
    updateSearchMap () {
      this.gMapsLoader.load((google) => {
        this.places = new google.maps.places.PlacesService(this.map);
        this.infoWindow = new google.maps.InfoWindow({
          content: this.$refs.info
        });
      })
    },
    async searchSelected() {
      this.searching = true
      await this.clearMarkers(this.markers);
      const fullResults = await this.buildList()
      this.placeMarkers(fullResults)
    },
    async clearMarkers(markers) {
      const vm = this
      return new Promise(function (success, reject){
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
        vm.markers = [];
        success()
      });
    },
    async testYelp () {
      const limit = this.limit;
      const mapLat = await this.map.center.lat();
      const mapLng = await this.map.center.lng();
      try {
        const response = await axios.get(`/api`, {
          params: {
            lat: mapLat,
            lng: mapLng,
            limit: limit,
          }
        })
        const list = response.data
        this.placeYelpMarkers(list)
      } catch (e) {
        console.log(e)
      }
    },
    async placeYelpMarkers(list) {
      console.log(list)
      // vm (Vue Model) to distinguish between scopes (see click event)
      const vm = this
      this.gMapsLoader.load((google) => {
        list.forEach((item, i) => {
          vm.markers[i] = new google.maps.Marker({
            position: {lat: item.coordinates.latitude, lng: item.coordinates.longitude},
            icon: utils.pinSymbol('red')
          });
          vm.markers[i].placeResult = item;
          google.maps.event.addListener(vm.markers[i], 'click', function() {
            vm.infoWindow.open(vm.map, this);
            vm.buildIWContent(item)
          });
          vm.markers[i].setMap(vm.map);
        })
      })
      console.log(this.markers)
    },
    async buildList () {
      return new Promise(resolve => {
        const lastStatus = null
        const list = []
        let counter = 0
        if (this.selected.length > 0) {
          for (var i = 0; i < this.selected.length; i++) {
            var search = {
              bounds: this.map.getBounds(),
              keyword: this.selected[i]
            };
            this.places.nearbySearch(search, (results, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK) {
                // sort the results of nearbySearch by rank and limit
                const sorted = sortThenLimit(results, this.limit)
                list.push(...sorted)
                counter++
                if(counter === this.selected.length) {
                  resolve(list);
                  this.searching = false
                }
              } else {
                counter++
                console.log(status)
                if(counter === this.selected.length) {
                  resolve(list);
                  this.searching = false
                }
              }
            });
          }
        } else {
          this.searching = false
          console.log('nothing selected')
        }
      });
    },
    async placeMarkers(list) {
      // vm (Vue Model) to distinguish between scopes (see click event)
      const vm = this
      this.gMapsLoader.load((google) => {
        list.forEach((item, i) => {
          vm.markers[i] = new google.maps.Marker({
            position: item.geometry.location,
            icon: utils.pinSymbol('red')
          });
          vm.markers[i].placeResult = item;
          google.maps.event.addListener(vm.markers[i], 'click', function() {
            vm.places.getDetails({placeId: this.placeResult.place_id},
            (place, status) => {
              if (status !== google.maps.places.PlacesServiceStatus.OK) {
                return;
              }
              vm.infoWindow.open(vm.map, this);
              vm.buildIWContent(place);
            });
          });
          vm.markers[i].setMap(vm.map);
        })
      })
    },
    buildIWContent(place) {
      console.log(place)
      this.iw = {
        name: place.name,
        url: place.url,
        address: place.location.display_address,
        phone: place.phone,
        rating: place.rating,
      }
    },
  },
  watch: {
    markers(){
      this.$emit('emitMarkers', this.markers)
    },
    map() {
      this.updateSearchMap()
    }
  }
};
</script>




