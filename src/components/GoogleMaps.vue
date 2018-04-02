<template>
  <div class="google-maps">
    <div class="google-maps__map" ref="map"></div>
    <input class="google-maps__loc" ref="loc" placeholder="Search Location"/>
    <input class="google-maps__places" ref="place" placeholder="Search Place"/>
    <button @click="searchSelected()">Search</button>
    <div style="display: none">
      <div id="info-content">
        <table>
          <tr id="iw-url-row" class="iw_table_row">
            <td id="iw-url">
              {{iw.name}}
            </td>
            <td id="iw-url">
              <a :href="iw.url">Url</a>
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
  </div>
</template>

<script>
/* eslint-disable */
import GoogleMapsLoader from 'google-maps';
GoogleMapsLoader.KEY = 'AIzaSyCS0KrhCnNOyW__KqWeeN-ZCC0ZuQNd3m4'
GoogleMapsLoader.LIBRARIES = ['places'];

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
      iw: {}
    };
  },
  mounted: function () {
    this.initMap()
    this.initLocationSearch()
  },
  methods: {
    initMap() {
      GoogleMapsLoader.load((google) => {
        this.map = new google.maps.Map(this.$refs.map, {
          zoom: 15,
          center: this.position
        })
        this.places = new google.maps.places.PlacesService(this.map);
        this.infoWindow = new google.maps.InfoWindow({
          content: document.getElementById('info-content')
        });
      })
    },
    initLocationSearch() {
      GoogleMapsLoader.load((google) => {
        const input = this.$refs.loc;
        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.addListener('place_changed', (place) => {
          var place = autocomplete.getPlace();
          var panPoint = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng());
          this.currentPlace = place
          this.map.panTo(panPoint)
        });
      })
    },
    initPlaceSearch() {
      GoogleMapsLoader.load((google) => {
        const input = this.$refs.place;
        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.setTypes(['establishment'])
        autocomplete.addListener('place_changed', () => {
          var place = autocomplete.getPlace();
        });
      })
    },
    searchSelected() {
      const vm = this
      GoogleMapsLoader.load((google) => {
        var search = {
          bounds: this.map.getBounds(),
          types: vm.selected
        };
        console.log(vm.selected)
        this.places.nearbySearch(search, (results, status) => {
          console.log(results)
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            vm.clearMarkers();
            // Create a marker for each hotel found, and
            // assign a letter of the alphabetic to each marker icon.
            for (var i = 0; i < results.length; i++) {
              // Use marker animation to drop the icons incrementally on the map.
              vm.markers[i] = new google.maps.Marker({
                position: results[i].geometry.location,
                animation: google.maps.Animation.DROP,
              });
              // If the user clicks a hotel marker, show the details of that hotel
              // in an info window.
              vm.markers[i].placeResult = results[i];
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
            }
          }
        });
      })
    },
    clearMarkers() {
      const vm = this
      for (var i = 0; i < vm.markers.length; i++) {
        if (vm.markers[i]) {
          vm.markers[i].setMap(null);
        }
      }
      vm.markers = [];
    },
    buildIWContent(place) {
      console.log(place)
      this.iw ={
        name: place.name,
        url: place.url,
        address: place.formatted_address,
        phone: place.formatted_phone_number,
        rating: place.rating,
        website: place.website,
      }
    }
  },
};
</script>
<style>
  .google-maps__map {
    height: 500px;
    width: 100%;
    display: block;
  }
</style>




