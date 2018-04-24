<template>
  <div class="hello-world">
    <ActivitySelect
      :options="options"
      @getActivities="getActivities"
    />
    <LocationSearch
      :gMapsLoader="googleMapsLoader"
      :map="globalMap"
    />
    <FindPlaces
      @emitMarkers="updateMarkers"
      @emitPlaces="updatePlaces"
      :selected="selectedActiv"
      :map="globalMap"
      :gMapsLoader="googleMapsLoader"
    />
    <Map
      :markers="globalMarkers"
      @emitMap="updateMap"
      @addToItinerary="updateItinerary"
      :selected="selectedActiv"
      :gMapsLoader="googleMapsLoader"
    />
    <Itinerary :places="globalItinerary"/>
  </div>
</template>

<script>
import gm from 'google-maps';
import activityList from './activityList.json';
import ActivitySelect from './ActivitySelect';
// import { db } from '../main';
import Map from './Map';
import LocationSearch from './LocationSearch';
import FindPlaces from './FindPlaces';
import Itinerary from './Itinerary';

gm.KEY = 'AIzaSyCS0KrhCnNOyW__KqWeeN-ZCC0ZuQNd3m4';
gm.LIBRARIES = ['places', 'geometry'];

export default {
  name: 'Initial',
  data() {
    return {
      googleMapsLoader: gm,
      globalMap: null,
      selectedActiv: [],
      options: activityList.activities,
      globalMarkers: [],
      globalPlaces: [],
      globalItinerary: [],
    };
  },
  // firestore() {
  //   return {
  //     dbActivities: db.collection('activities'),
  //   };
  // },
  methods: {
    getActivities(activities) {
      const map = activities.map(activity => activity.name);
      this.selectedActiv = map;
    },
    updateMap(newMap) {
      this.globalMap = newMap;
    },
    updateMarkers(newMarkers) {
      this.globalMarkers = newMarkers;
    },
    updatePlaces(newPlaces) {
      this.globalPlaces = newPlaces;
      this.globalItinerary.push(this.globalPlaces);
    },
    updateItinerary(id) {
      const vm = this;
      this.googleMapsLoader.load((google) => {
        const service = new google.maps.places.PlacesService(vm.globalMap);
        service.getDetails({
          placeId: id,
        }, (place) => {
          vm.globalItinerary.push(place);
        });
      });
    },
  },
  components: { ActivitySelect, LocationSearch, FindPlaces, Map, Itinerary },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
