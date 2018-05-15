<template>
  <div class="o-root">
    <main class="o-main">
      <div class="c-user">
        <div class="c-user__icon">
        </div>
        <h2 class="c-user__name">
          Chris Konings
        </h2>
        <a class="c-user__logout">
          Logout
        </a>
      </div>
      <div class="c-status c-status--empty">
        <span>You don’t have any plans today.</span>
        <small>Why tho?</small>
      </div>
      <div class="c-menu">
        <ul class="c-menu__tabs">
          <li class="c-menu__tab">
            <button class="c-menu__tab-btn c-menu__tab-btn--is-active">
              Places
            </button>
          </li>
          <li class="c-menu__tab">
            <button class="c-menu__tab-btn">Itineraries</button>
          </li>
        </ul>
        <div class="c-menu__cont">
          <form class="c-form c-form--menu">
            <LocationSearch
            class="c-form-item"
            :gMapsLoader="googleMapsLoader"
            :map="globalMap"
            />
            <ActivitySelect
            class="c-form-item"
            :options="options"
            @getActivities="getActivities"
            />
            <FindPlaces
            @emitMarkers="updateMarkers"
            @emitPlaces="updatePlaces"
            :selected="selectedActiv"
            :map="globalMap"
            :gMapsLoader="googleMapsLoader"
            />
          </form>
        </div>
      </div>
      <Itinerary v-if="globalItinerary.length >= 1" :places="globalItinerary"/>
    </main>
    <aside class="o-aside">
      <Map
        :markers="globalMarkers"
        @emitMap="updateMap"
        @addToItinerary="updateItinerary"
        :selected="selectedActiv"
        :gMapsLoader="googleMapsLoader"
      />
    </aside>
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
    updatePlaces(newPlace) {
      this.globalPlace = newPlace;
      this.globalItinerary.push(this.globalPlace);
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
