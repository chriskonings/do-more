<template>
  <div class="o-root">
    <div v-if="!globalMap" class="spinner"></div>
    <main class="o-main" v-if="globalMap">
      <User
        :user="user"
        @showUserMenu="menu = 3"
      />
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
          <button
            v-show="menu === 0"
            @click="getLocation(true)"
            class="c-btn c-btn--naked"
          >
            Get location
          </button>
          <LocationSearch
            class="c-form__item"
            v-show="menu === 0"
            :map="globalMap"
            :google="google"
          />
          <FindPlaces
            v-show="menu === 0"
            @emitMarkers="updateMarkers"
            @clearMarkers="clearMarkers"
            @createMarker="createMarker"
            :user="user"
            :map="globalMap"
            :radius="radius"
            :infoWindow="infoWindow"
            :savePlace="savePlace"
            :markers="globalMarkers"
          />
          <HotList
            v-if="menu === 2"
            @panToPlace="panToPlace"
            @savePlace="savePlace"
            :user="user"
            :map="globalMap"
            :infoWindow="infoWindow"
            :markers="globalMarkers"
            @createMarker="createMarker"
          />
          <MyFinds
            v-if="user && menu === 3"
            @panToPlace="panToPlace"
            @createMarker="createMarker"
            :map="globalMap"
            :user="user"
            :infoWindow="infoWindow"
            :markers="globalMarkers"
            @updateInterests="updateUserInterests"
          />
        </div>
      </div>
    </main>
    <aside v-if="google" class="o-aside" :class="{'o-aside--fullscreen': isMapFullscreen}">
      <Map
        :markers="globalMarkers"
        @emitMap="updateMap"
        :infoWindow="infoWindow"
        :google="google"
        @fullscreenMap="fullscreenMap"
        @getLocation="getLocation"
      />
    </aside>
    <MobileMapBtn @fullscreenMap="fullscreenMap"/>
    <InfoWindow
      ref="infoW"
      :place="infoWindow.content"
      :savePlace="savePlace"
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
import MobileMapBtn from './MobileMapBtn'
import { db } from '../firebase';

function getUser(user) {
  const userObj = {
    uid: user.uid,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
  // check if user exists in user DB, if it does return it
  // else set the user in the DB and return
  return db.ref(`users/${user.uid}`).once('value').then((snap) => {
    if (snap.val()) {
      return snap.val();
    }
    return db.ref(`users/${user.uid}`).set(userObj, (err) => {
      if (err) {
        console.log(err);
        return err;
      }
      return userObj;
    });
  });
}

function buildPlaceObj(p, user) {
  let newPlace = {
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
  return newPlace;
}

export default {
  name: 'Initial',
  props: ['google'],
  data() {
    return {
      user: null,
      menu: 0,
      infoWindow: {
        el: null,
        content: null,
      },
      globalMap: null,
      globalMarkers: [],
      isMapFullscreen: false,
      myPosPin: null,
    };
  },
  async created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        getUser(user).then((userObj) => {
          this.user = userObj;
        });
      } else {
        this.user = null
      }
    });
    gm.load((google) => {
      this.infoWindow.el = new google.maps.InfoWindow({
        content: this.$refs.infoW.$el,
      });
    });
  },
  methods: {
    getLocation(highAccuracy) {
      const google = this.google;
      if (navigator.geolocation) {
        const options = {
          enableHighAccuracy: highAccuracy,
          timeout: 10000,
          maximumAge: 0,
        };
        navigator.geolocation.getCurrentPosition((pos) => {
          const crd = pos.coords;
          const panPoint = new google.maps.LatLng(crd.latitude, crd.longitude);
          this.globalMap.panTo(panPoint);
          this.placeMyPosPin(crd.latitude, crd.longitude);
        }, (err) => {
          console.warn(`ERROR(${err.code}): ${err.message}`);
          if (err.code === 3) {
            this.getLocation(false)
          }
        }, options);
      }
    },
    async placeMyPosPin(lat, lng) {
      const google = this.google;
      const icon = this.$utils.pinSymbol();
      if (this.myPosPin) this.myPosPin.setMap(null);
      this.myPosPin = new google.maps.Marker({
        position: { lat, lng },
        icon,
        animation: google.maps.Animation.DROP,
      });
      this.myPosPin.setMap(this.globalMap);
    },
    fullscreenMap() {
      this.isMapFullscreen = !this.isMapFullscreen
    },
    createMarker(marker) {
      this.globalMarkers.push(marker);
    },
    async clearMarkers() {
      // To do - only remove markers not found in list of places
      return new Promise((success) => {
        for (let i = 0; i < this.globalMarkers.length; i += 1) {
          this.globalMarkers[i].setMap(null);
        }
        this.globalMarkers = [];
        success();
      });
    },
    savePlace(place) {
      // add to local place users
      const placeId = place.place ? place.place.id : place.id;
      const placeRef = db.ref('finds').orderByChild('place/id').equalTo(placeId);
      const userObj = {
        uid: this.user.uid,
        displayName: this.user.displayName,
        photoURL: this.user.photoURL,
      };
      placeRef.once('value').then(async (snap) => {
        if (snap.val()) {
          const placeObj = snap.val();
          const placeKey = Object.keys(placeObj)[0];
          db.ref(`finds/${placeKey}/users/${this.user.uid}`).set(userObj);
          this.addToSaved(placeKey, place, userObj);
          // move marker create to place savePlace is called?
          const m = this.$utils.newMarker(
            placeObj[placeKey],
            place.users,
            this.globalMap,
            this.infoWindow,
            this.globalMarkers,
          );
          this.createMarker(m);
        } else {
          const placeObj = buildPlaceObj(place, this.user);
          db.ref('finds').push(placeObj).then((pushed) => {
            this.addToSaved(pushed.key, placeObj, userObj);
            const m = this.$utils.newMarker(
              place,
              placeObj.users,
              this.globalMap,
              this.infoWindow,
              this.globalMarkers,
            );
            this.createMarker(m);
          });
        }
      });
    },
    addToSaved(key, place, user) {
      if (this.user.saved) {
        this.$set(this.user.saved, key, true);
      } else {
        this.$set(this.user, 'saved', {});
        this.$set(this.user.saved, key, true);
      }
      if (place.users) {
        this.$set(place.users, this.user.uid, user);
      } else {
        this.$set(place, 'users', {});
        this.$set(place.users, this.user.uid, user);
      }
      db.ref(`users/${this.user.uid}`).child(`saved/${key}`).set(true);
    },
    panToPlace(p) {
      const google = this.google;
      const latLng = new google.maps.LatLng(p.place.pos.lat, p.place.pos.lng);
      const m = this.$utils.newMarker(
        p,
        p.users,
        this.globalMap,
        this.infoWindow,
        this.globalMarkers,
      );
      this.createMarker(m);
      this.globalMap.panTo(latLng);
      this.infoWindow.el.open(this.globalMap, m);
      this.infoWindow.content = p.place;
    },
    updateMap(map) {
      this.globalMap = map;
    },
    updateMarkers(m) {
      this.globalMarkers = m;
    },
    updateUserInterests(list) {
      this.$set(this.user, 'interests', list);
    }
    // panMap (google) {
    //   const bounds = new google.maps.LatLngBounds();
    //   for (var i = 0; i < this.globalMarkers.length; i++) {
    //     bounds.extend(this.globalMarkers[i].getPosition());
    //   }
    //   this.globalMap.fitBounds(bounds);
    // },
  },
  computed: {
    radius() {
      let radius;
      const bounds = this.globalMap.getBounds();
      const center = this.globalMap.getCenter();
      if (bounds && center) {
        const ne = bounds.getNorthEast();
        radius = this.google.maps.geometry.spherical.computeDistanceBetween(center, ne);
      }
      return Math.floor(radius);
    },
  },
  components: {
    LocationSearch,
    FindPlaces,
    Map,
    MyFinds,
    HotList,
    InfoWindow,
    User,
    MobileMapBtn,
  },
};
</script>
