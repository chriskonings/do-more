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
          <HotList v-if="menu === 2"/>
          <MyFinds v-if="user && menu === 3" :user="user"/>
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
import MyFinds from './MyFinds';
import HotList from './HotList';
import InfoWindow from './InfoWindow';
import User from './User';
import { db } from '../firebase';

function addToSaved (user, key) {
  if (user.saved) {
    user.saved[key] = key
  } else {
    user.saved = {}
    user.saved[key] = key
  }
  db.ref('users/' + user.uid).child('saved/' + key).set(key)
}

function buildPlaceObj (p, user) {
  let newPlace = {}
  if (p.place) {
    let city = null
    let country = null
    for (var addr of p.place.address_components) {
      if (addr.types.includes('locality')) {
        city = addr.short_name;
      } else if (addr.types.includes('country')) {
        country = addr.short_name;
      }
    }
    newPlace = {
      users: {
        [user.uid]: {
          id: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        },
      },
      place: {
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
        [user.uid]: {
          id: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
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
  return newPlace
}

export default {
  name: 'Initial',
  props: ['googleMaps'],
  data() {
    return {
      itinerary: null,
      user: null,
      userFinds: [],
      userFindsIDs: [],
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
    firebase.auth().onAuthStateChanged((user) => {
      const userObj = {
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
      }
      db.ref('users/' + user.uid).once('value').then((snap) => {
        if (snap.val()) {
          this.user = snap.val()
        } else {
          db.ref('users/' + user.uid).set(userObj, (err) => {
            if (err) {
              console.log(err)
            } else {
              this.user = userObj
            }
          });
        }
      });
    });
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
      return new Promise((success, reject) => {
        for (let i = 0; i < vm.globalMarkers.length; i++) {
          vm.globalMarkers[i].setMap(null);
        }
        vm.globalMarkers = [];
        success()
      });
    },
    async claimPlace(p) {
      let alreadySaved = true
      let placeRef
      let placeKey
      if (p.place) {
        placeRef = db.ref('finds').orderByChild('place/id').equalTo(p.place.id);
      } else {
        placeRef = db.ref('finds').orderByChild('place/id').equalTo(p.id);
      }
      placeRef.once('value').then((snap) => {
        if (snap.val()) {
          placeKey = Object.keys(snap.val())[0];
          addToSaved(this.user, placeKey)
          db.ref('finds/' + placeKey + '/users/' + this.user.uid).set({
            uid: this.user.uid,
            displayName: this.user.displayName,
            photoURL: this.user.photoURL
          })
        } else {
          const placeObj = buildPlaceObj(p, this.user)
          db.ref('finds').push(placeObj).then((snap) => {
            addToSaved(this.user, snap.key)
          })
        }
      });
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
    MyFinds,
    HotList,
    InfoWindow,
    User,
  },
};
</script>
