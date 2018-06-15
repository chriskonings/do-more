<template>
  <div class="o-root">
    <main class="o-main">
      <User :user="user"/>
      <!--- user preferences here -->
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
              Discover
            </button>
          </li>
          <li class="c-menu__tab">
            <button
              :disabled="!user"
              class="c-menu__tab-btn"
              @click="menu.places = false"
              :class="{' c-menu__tab-btn--is-active': menu.places === false}"
            >
              Gems
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
            <Itineraries
              v-show="!showPlaces"
              :itineraries="itineraries"
              :user="user"
              @getPlaces="getPlaces"/>
            <Itinerary
              v-if="showPlaces"
              :user="user"
              :places="places"
              :gMapsLoader="googleMapsLoader"
              @getItineraries="getItineraries"/>
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
      :itineraries="itineraries"
      :addToItinerary="updatePlaces"
    />
  </div>
</template>

<script>
import firebase from 'firebase';
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
import { db } from '../firebase';

export default {
  name: 'Initial',
  data() {
    return {
      user: null,
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
      places: [],
      itineraries: [],
      showPlaces: false
    };
  },
  created() {
    const vm = this;
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        vm.user = user;
        this.$bindAsArray('itineraries', db.ref('itineraries').orderByChild('user').equalTo(this.user.uid));
      } else {
        vm.user = null;
      }
    });
    this.googleMapsLoader.load((google) => {
      this.infoWindow.el = new google.maps.InfoWindow({
        content: this.$refs.info.$el,
      });
    });
  },
  methods: {
    getActivities(activities) {
      this.selectedActiv = activities.map(activity => activity.name);
    },
    updateMap(map) {
      this.globalMap = map;
    },
    updateMarkers(m) {
      this.globalMarkers = m;
    },
    updatePlaces(id, newPlace) {
      const place = {
        user: this.user.uid,
        itinerary: id,
        place: {
          id: newPlace.place.id,
          name: newPlace.name,
          pos: {
            lat: newPlace.place.geometry.location.lat(),
            lng: newPlace.place.geometry.location.lng(),
          },
          image_url: typeof newPlace.place.photos !== 'undefined'
          ? newPlace.place.photos[0].getUrl({'maxWidth': 100, 'maxHeight': 100})
          : ''
        },
      };
      db.ref('places').push(place);
      // this.globalPlace = newPlace;
      // this.globalItinerary.push(this.globalPlace);
    },
    getPlaces(list) {
      this.places = list;
      this.showPlaces = true
    },
    getItineraries () {
      this.showPlaces = false
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
