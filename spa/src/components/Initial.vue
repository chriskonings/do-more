<template>
  <div class="o-root">
    <main class="o-main">
      <User/>
      <div class="c-status c-status--empty">
        <span>You don’t have any plans today.</span>
        <small>Why tho?</small>
      </div>
      <div class="c-menu">
        <ul class="c-menu__tabs">
          <li class="c-menu__tab">
            <button
              @click="menu.places = true"
              class="c-menu__tab-btn"
              :class="{' c-menu__tab-btn--is-active': menu.places === true}"
            >
              Places
            </button>
          </li>
          <li class="c-menu__tab">
            <button
              class="c-menu__tab-btn"
              @click="menu.places = false"
              :class="{' c-menu__tab-btn--is-active': menu.places === false}"
            >
              Itineraries
            </button>
          </li>
        </ul>
        <div class="c-menu__cont">
          <template v-if="menu.places">
            <form class="c-form c-form--menu">
              <LocationSearch
              class="c-form__item"
              :gMapsLoader="googleMapsLoader"
              :map="globalMap"
              />
              <ActivitySelect
              class="c-form__item"
              :options="options"
              @getActivities="getActivities"
              />
              <FindPlaces
              @emitMarkers="updateMarkers"
              :selected="selectedActiv"
              :map="globalMap"
              :gMapsLoader="googleMapsLoader"
              :infoWindow="infoWindow"
              />
            </form>
          </template>
          <template v-else>
            <Itineraries/>
            <Itinerary v-if="globalItinerary.length >= 1" :places="globalItinerary"/>
          </template>
        </div>
      </div>
    </main>
    <aside class="o-aside">
      <Map
        :markers="globalMarkers"
        @emitMap="updateMap"
        :selected="selectedActiv"
        :gMapsLoader="googleMapsLoader"
        :infoWindow="infoWindow"
      />
    </aside>
    <InfoWindow
      ref="info"
      :place="infoWindow.content"
      :addToItinerary="updatePlaces"
    />
  </div>
</template>

<script>
import gm from 'google-maps';
import activityList from './activityList.json';
import ActivitySelect from './ActivitySelect';
import Map from './Map';
import LocationSearch from './LocationSearch';
import FindPlaces from './FindPlaces';
import Itinerary from './Itinerary';
import Itineraries from './Itineraries';
import InfoWindow from './InfoWindow';
import User from './User';

export default {
  name: 'Initial',
  data() {
    return {
      menu: {
        places: true,
      },
      infoWindow: {
        el: null,
        content: null,
      },
      googleMapsLoader: gm,
      globalMap: null,
      selectedActiv: [],
      options: activityList.activities,
      globalMarkers: [],
      globalPlaces: [],
      globalItinerary: [],
    };
  },
  created() {
    this.googleMapsLoader.load((google) => {
      this.infoWindow.el = new google.maps.InfoWindow({
        content: this.$refs.info.$el,
      });
    });
  },
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
  components: {
    ActivitySelect,
    LocationSearch,
    FindPlaces,
    Map,
    Itinerary,
    Itineraries,
    InfoWindow,
    User,
  },
};
</script>
