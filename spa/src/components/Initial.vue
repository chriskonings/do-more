<template>
  <div class="hello-world">
    <Search
      :options="options"
      @getActivities="getActivities"
    />
    <PlaceSearch
      :gMapsLoader="googleMapsLoader"
      :map="globalMap"
    />
    <ActivitySearch
      @emitMarkers="updateMarkers"
      :selected="selectedActiv"
      :map="globalMap"
      :gMapsLoader="googleMapsLoader"
      :limit="limit"
    />
    <input id="number" type="number" v-model="limit">
    <GoogleMaps
      :markers="globalMarkers"
      @emitMap="updateMap"
      :selected="selectedActiv"
      :gMapsLoader="googleMapsLoader"
    />
  </div>
</template>

<script>

import gm from 'google-maps';
import Search from './Search';
// import { db } from '../main';
import GoogleMaps from './GoogleMaps';
import activityList from './activityList.json';
import PlaceSearch from './placeSearch';
import ActivitySearch from './activitySearch';

gm.KEY = 'AIzaSyCS0KrhCnNOyW__KqWeeN-ZCC0ZuQNd3m4';
gm.LIBRARIES = ['places'];

export default {
  name: 'Initial',
  data() {
    return {
      googleMapsLoader: gm,
      globalMap: null,
      selectedActiv: [],
      options: activityList.activities,
      globalMarkers: [],
      limit: 2,
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
  },
  components: { Search, PlaceSearch, ActivitySearch, GoogleMaps },
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
