<template>
  <div class="o-root">
    <main class="o-main">
      <User :user="user"/>
      <!--- user preferences here -->
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
              My gems
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
              @emitPlaces="findPlaces"
              :selected="selectedActiv"
              :map="globalMap"
              :gMapsLoader="googleMapsLoader"
              :infoWindow="infoWindow"
              />
            </form>
            <div v-for="p in places">
              {{p.name}}
              <button class="c-btn c-btn--link" @click.prevent="addToItinerary(itinerary, p)">
                Save
              </button>
            </div>
          </template>
          <template v-else>
            <MyGems :user="user"/>
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
      :addToItinerary="addToItinerary"
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
import MyGems from './MyGems';
import Itinerary from './Itinerary';
import Itineraries from './Itineraries';
import InfoWindow from './InfoWindow';
import User from './User';
import { db } from '../firebase';

export default {
  name: 'Initial',
  data() {
    return {
      itinerary: null,
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
      itineraryList: [],
      showPlaces: false
    };
  },
  created() {
    const vm = this;
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        vm.user = user;
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
    findPlaces(p) {
      this.places = p
    },
    getActivities(activities) {
      this.selectedActiv = activities.map(activity => activity.name);
    },
    updateMap(map) {
      this.globalMap = map;
    },
    updateMarkers(m) {
      this.globalMarkers = m;
    },
    addToItinerary(id, newPlace) {
      let place = {}
      if (newPlace.place) {
        place = {
          user: this.user.uid,
          place: {
            id: newPlace.place.id,
            name: newPlace.place.name,
            pos: {
              lat: newPlace.place.geometry.location.lat(),
              lng: newPlace.place.geometry.location.lng(),
            },
            image_url: typeof newPlace.place.photos !== 'undefined'
            ? newPlace.place.photos[0].getUrl({'maxWidth': 100, 'maxHeight': 100})
            : '',
            link: newPlace.url
          }
        };
      } else {
        place = {
          user: this.user.uid,
          place: {
            id: newPlace.id,
            name: newPlace.name,
            pos: {
              lat: newPlace.coordinates.latitude,
              lng: newPlace.coordinates.longitude,
            },
            image_url: newPlace.image_url,
            link: newPlace.url
          },
        };
      }
      db.ref('gems').push(place);
    },
    getPlaces(list) {
      this.itineraryList = list;
      this.showPlaces = true
    },
    getItineraries () {
      this.showPlaces = false
    },
  },
  watch: {
    itineraries() {
      if (this.itineraries.length) {
        this.itinerary = this.itineraries[0]['.key']
      }
    }
  },
  components: {
    ActivitySelect,
    LocationSearch,
    FindPlaces,
    Map,
    MyGems,
    InfoWindow,
    User,
  },
};
</script>
