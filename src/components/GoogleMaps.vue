<template>
  <div class="google-maps">
    <label>Search location</label>
    <input class="google-maps__search" ref="loc" placeholder="Search Location"/>
    <button class="google-maps__loc" @click="searchSelected()">Search</button>
    <div class="google-maps__map" ref="map"></div>
    <div style="display: none">
      <div ref="info">
        <table>
          <tr id="iw-url-row" class="iw_table_row">
            <td id="iw-url">
              {{iw.name}}
            </td>
            <td id="iw-url">
              <a :href="iw.url" target="_blank">Map</a>
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
          <tr id="iw-website-row" class="iw_table_row">
            <td class="iw_attribute_name">Website:</td>
            <td id="iw-website">
              <a :href="iw.website">Link</a>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div>{{errors}}</div>
  </div>
</template>

<script>
/* eslint-disable */
import GoogleMapsLoader from 'google-maps';
GoogleMapsLoader.KEY = 'AIzaSyCS0KrhCnNOyW__KqWeeN-ZCC0ZuQNd3m4'
GoogleMapsLoader.LIBRARIES = ['places'];
import axios from 'axios';

export default {
  name: 'GoogleMaps',
  props: ['selected'],
  data() {
    return {
      position: { lat: 0, lng: 0 },
      map: null,
      markers: [],
      currentPlace: null,
      places: null,
      infoWindow: null,
      iw: {},
      errors: [],
    };
  },
  mounted() {
    this.initMap()
    this.initLocationSearch()
  },
  methods: {
    initMap() {
      GoogleMapsLoader.load((google) => {
        this.map = new google.maps.Map(this.$refs.map, {
          zoom: 17,
          center: this.position
        })
        this.places = new google.maps.places.PlacesService(this.map);
        this.infoWindow = new google.maps.InfoWindow({
          content: this.$refs.info
        });
      })
    },
    initLocationSearch() {
      GoogleMapsLoader.load((google) => {
        const input = this.$refs.loc;
        var autocomplete = new google.maps.places.Autocomplete(input);
        // autocomplete.setTypes(['regions'])
        autocomplete.addListener('place_changed', (place) => {
          var place = autocomplete.getPlace();
          var panPoint = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng());
          this.currentPlace = place
          this.map.panTo(panPoint)
        });
      })
    },
    async searchSelected() {
      const lastStatus = null
      const list = []
      let counter = 0
      for (var i = 0; i < this.selected.length; i++) {
        var search = {
          bounds: this.map.getBounds(),
          type: this.selected[i]
        };
        this.places.nearbySearch(search, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            list.push(...results)
            counter++
            if(counter === this.selected.length) {
              this.placeMarkers(list)
            }
          }
        });
      }
    },
    async placeMarkers(list) {
      const vm = this
      vm.clearMarkers();
      GoogleMapsLoader.load((google) => {
        list.forEach((item, i) => {
          vm.markers[i] = new google.maps.Marker({
            position: item.geometry.location
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
    clearMarkers() {
      for (var i = 0; i < this.markers.length; i++) {
        if (this.markers[i]) {
          this.markers[i].setMap(null);
        }
      }
      this.markers = [];
    },
    buildIWContent(place) {
      this.iw ={
        name: place.name,
        url: place.url,
        address: place.formatted_address,
        phone: place.formatted_phone_number,
        rating: place.rating,
        website: place.website,
      }
    },
    activitySearch(lat, lng) {
      axios.get(`http://api.amp.active.com/v2/search/?lat_lon=${lat}%2C+${lng}&query=running&current_page=1&per_page=10&sort=distance&exclude_children=true&api_key=vevqj4p8x76u8fg6jupgs3zf`)
      .then(response => {
        console.log(response.data)
      })
      .catch(e => {
        this.errors.push(e)
      })
    }
  },
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




