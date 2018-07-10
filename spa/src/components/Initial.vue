<template>
  <div class="o-root">
    <div v-if="!globalMap" class="spinner"></div>
    <main class="o-main" v-if="globalMap">
      <User :user="user" @showUserMenu="menu = 3"/>
      <!--- user preferences here -->
      <div class="c-menu">
        <ul class="c-menu__tabs">
          <li class="c-menu__tab">
            <button
              @click="menu = 0"
              class="c-menu__tab-btn"
              :class="{' c-menu__tab-btn--is-active': menu === 0}"
            >
              Discover
            </button>
          </li>
          <li class="c-menu__tab">
            <button
              :disabled="!user"
              class="c-menu__tab-btn"
              @click="menu = 2"
              :class="{' c-menu__tab-btn--is-active': menu === 2}"
            >
              Hot
            </button>
          </li>
        </ul>
        <div class="c-menu__cont">
          <LocationSearch
            class="c-form__item"
            v-show="menu === 0"
            :map="globalMap"
          />
          <FindPlaces
            v-show="menu === 0"
            @emitMarkers="updateMarkers"
            @clearMarkers="clearMarkers"
            :user="user"
            :map="globalMap"
            :radius="radius"
            :infoWindow="infoWindow"
            :claimPlace="claimPlace"
          />
          <Finds v-if="menu === 2"/>
          <MyGems v-show="menu === 3" v-if="user" :user="user"/>
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
      ref="infoW"
      :place="infoWindow.content"
      :claimPlace="claimPlace"
    />
  </div>
</template>

<script>
import firebase from 'firebase';
import Map from './Map';
import LocationSearch from './LocationSearch';
import FindPlaces from './FindPlaces';
import MyGems from './MyGems';
import Finds from './Finds';
import InfoWindow from './InfoWindow';
import User from './User';
import { db } from '../firebase';

export default {
  name: 'Initial',
  props: ['googleMaps'],
  data() {
    return {
      itinerary: null,
      user: null,
      menu: 0,
      infoWindow: {
        el: null,
        content: null,
      },
      globalMap: null,
      selectedActiv: [],
      globalMarkers: [],
      showPlaces: false
    };
  },
  async created() {
    const vm = this;
    firebase.auth().onAuthStateChanged((user) => this.user = user);
    gm.load((google) => {
      this.infoWindow.el = new google.maps.InfoWindow({
        content: this.$refs.infoW.$el,
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
    claimPlace(p) {
      // To do - if ID is found in gems DB then just update the users array
      let newPlace = {}
      if (p.place) {
        let city = null
        let country = null
        for (var addr of p.place.address_components) {
          if (addr.types.includes('postal_town')) {
            city = addr.short_name;
          } else if (addr.types.includes('country')) {
            country = addr.short_name;
          }
        }
        newPlace = {
          place: {
            users: {
              [this.user.uid]: {
                id: this.user.uid,
                displayName: this.user.displayName,
                photoURL: this.user.photoURL,
              },
            },
            id: p.place.id,
            name: p.place.name,
            city: city,
            country: country,
            pos: {
              lat: p.place.geometry.location.lat(),
              lng: p.place.geometry.location.lng(),
            },
            image_url: typeof p.place.photos !== 'undefined'
            ? p.place.photos[0].getUrl({'maxWidth': 100, 'maxHeight': 100})
            : '',
            link: p.url,
          }
        };
      } else {
        newPlace = {
          users: {
            [this.user.uid]: {
              id: this.user.uid,
              displayName: this.user.displayName,
              photoURL: this.user.photoURL,
            },
          },
          place: {
            id: p.id,
            name: p.name,
            city: p.location.city,
            country: p.location.country,
            pos: {
              lat: p.coordinates.latitude,
              lng: p.coordinates.longitude,
            },
            image_url: p.image_url,
            link: p.url,
          },
        };
      }
      db.ref('gems').push(newPlace);
    },
    getPlaces(list) {
      this.itineraryList = list;
      this.showPlaces = true;
    },
    getItineraries () {
      this.showPlaces = false;
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
  components: {
    LocationSearch,
    FindPlaces,
    Map,
    MyGems,
    Finds,
    InfoWindow,
    User,
  },
};
</script>
