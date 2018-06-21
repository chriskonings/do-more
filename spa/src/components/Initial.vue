<template>
  <div class="o-root">
    <div v-if="!globalMap" class="spinner"></div>
    <main class="o-main" v-if="globalMap">
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
          <LocationSearch
            class="c-form__item"
            v-show="menu.places"
            :map="globalMap"
          />
          <FindPlaces
            v-show="menu.places"
            @emitMarkers="updateMarkers"
            @clearMarkers="clearMarkers"
            :user='user'
            :map="globalMap"
            :radius="radius"
            :infoWindow="infoWindow"
            :addToItinerary="addToItinerary"
          />
          <MyGems v-show="!menu.places" v-if="user" :user="user"/>
        </div>
      </div>
    </main>
    <aside v-if="googleMaps" class="o-aside">
      <Map
        :markers="globalMarkers"
        @emitMap="updateMap"
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
import Map from './Map';
import LocationSearch from './LocationSearch';
import FindPlaces from './FindPlaces';
import MyGems from './MyGems';
import InfoWindow from './InfoWindow';
import User from './User';
import { db } from '../firebase';

export default {
  name: 'Initial',
  props: ['google'],
  data() {
    return {
      googleMaps: null,
      loading: false,
      itinerary: null,
      user: null,
      menu: {
        places: true,
      },
      infoWindow: {
        el: null,
        content: null,
      },
      globalMap: null,
      selectedActiv: [],
      globalMarkers: [],
      itineraries: [],
      itineraryList: [],
      showPlaces: false
    };
  },
  async created() {
    const vm = this;
    firebase.auth().onAuthStateChanged((user) =>  this.user = user);
    this.google.load((gm) => {
      this.googleMaps = gm.maps
      this.infoWindow.el = new google.maps.InfoWindow({
        content: this.$refs.info.$el,
      });
    });
  },
  methods: {
    updateMap(map) {
      this.globalMap = map;
    },
    updateMarkers(m) {
      this.globalMarkers = m;
    },
    async clearMarkers() {
      // To do - only remove markers not found in list of places
      const vm = this
      return new Promise(function (success, reject){
        for (let i = 0; i < vm.globalMarkers.length; i++) {
          vm.globalMarkers[i].setMap(null);
        }
        vm.globalMarkers = [];
        success()
      });
    },
    addToItinerary(newPlace) {
      // To do - if ID is found in gems DB then just update the users array
      let place = {}
      if (newPlace.place) {
        let city = null
        let country = null
        for (var addr of newPlace.place.address_components) {
          if (addr.types.includes('postal_town')) {
            city = addr.short_name
          } else if (addr.types.includes('country')) {
            country = addr.short_name
          }
        }
        place = {
          place: {
            users: {
              [this.user.uid]: {
                id: this.user.uid,
                displayName: this.user.displayName,
                photoURL: this.user.photoURL,
              },
            },
            id: newPlace.place.id,
            name: newPlace.place.name,
            city: city,
            country: country,
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
          users: {
            [this.user.uid]: {
              id: this.user.uid,
              displayName: this.user.displayName,
              photoURL: this.user.photoURL,
            },
          },
          place: {
            id: newPlace.id,
            name: newPlace.name,
            city: newPlace.location.city,
            country: newPlace.location.country,
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
    panMap (google) {
      const bounds = new google.maps.LatLngBounds();
      for (var i = 0; i < this.globalMarkers.length; i++) {
        bounds.extend(this.globalMarkers[i].getPosition());
      }
      this.globalMap.fitBounds(bounds);
    },
  },
  computed: {
    radius() {
      let radius;
      const bounds = this.globalMap.getBounds();
      const center = this.globalMap.getCenter();
      if (bounds && center) {
        const ne = bounds.getNorthEast();
        radius = this.googleMaps.geometry.spherical.computeDistanceBetween(center, ne);
      }
      return Math.floor(radius);
    }
  },
  watch: {
    itineraries() {
      if (this.itineraries.length) {
        this.itinerary = this.itineraries[0]['.key']
      }
    }
  },
  components: {
    LocationSearch,
    FindPlaces,
    Map,
    MyGems,
    InfoWindow,
    User,
  },
};
</script>
