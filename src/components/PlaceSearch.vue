<template>
  <div>
    <input ref="autocomplete" type="text" placeholder="Places Search">
    <div id="map"></div>
  </div>
</template>

<script>
/* eslint-disable */
var GoogleMapsLoader = require('google-maps');

export default {
  name: 'PlaceSearch',
  data() {
    return {
      pos: { lat: 0, lng: 0 },
      activities: [],
    };
  },
  mounted() {
    this.initSearch();
  },
  methods: {
    createMarker() {
      var placeLoc = place.geometry.location;
      var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
      });

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
      });
    },
    initSearch() {
      var map;
      var infowindow;

      GoogleMapsLoader.load(function(google) {
        map = new google.maps.Map(document.getElementById('map'), {
          center: pyrmont,
          zoom: 15
        });

        infowindow = new google.maps.InfoWindow();

        const pyrmont = {lat: -33.867, lng: 151.195};
        const service = new google.maps.places.PlacesService(map);
        console.log(service)
        service.nearbySearch({
          location: pyrmont,
          radius: 500,
          type: ['store']
        }, this.callback);
      });
    },
    callback(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          console.log(results[i]);
        }
      }
    }
  },
};
</script>

