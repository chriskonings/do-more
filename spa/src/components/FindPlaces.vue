<template>
  <div>
    <Accordion label="Filter">
      <ActivitySelect
        @getActivities="getActivities"
      />
      <div>
        <label class="c-label">Order</label>
        <select v-model="sortBy" class="c-select">
          <option value="distance">Distance</option>
          <option value="best_match">Best Match</option>
          <option value="rating">Rating</option>
          <option value="review_count">Review Count</option>
        </select>
      </div>
    </Accordion>
    <div class="u-txt-center">
      <div v-if="searching" class="spinner"></div>
      <button
        v-else
        :disabled="searching"
        @click.prevent="search"
        class="c-btn"
      >
        Search
      </button>
    </div>
    <Places
      v-if="places"
      :places="places"
      :savePlace="savePlace"
      :user="user"
      :page="page"
      @getPlaces="getPlaces"
      :loading="searching"
      :markers="markers"
      :map="map"
      :infoWindow="infoWindow"
    />
  </div>
</template>

<script>
/* eslint-disable */
import { db } from '../firebase';
import utils from './utils'
import axios from 'axios'
import ActivitySelect from './ActivitySelect';
import Accordion from './Accordion'
import Places from './Places'
import emptyHeart from '../assets/empty-heart.svg'
import fullHeart from '../assets/full-heart.svg'

export default {
  name: 'FindPlaces',
  props: [
    'infoWindow',
    'radius',
    'map',
    'savePlace',
    'user',
  ],
  data() {
    return {
      page: 0,
      places: [],
      markers: [],
      selected: [],
      searching: false,
      places: null,
      sortBy: 'best_match'
    };
  },

  methods: {
    async getPlaces() {
      this.searching = true
      if (this.page === 0) this.places = []
      this.places = await this.buildList()
      this.placeYelpMarkers()
      if (this.places.length >= 25) this.page += 1
      this.searching = false
    },
    async search() {
      this.page = 0
      await this.getPlaces()
    },
    async buildList () {
      let places = []
      const lastStatus = null;
      if (this.selected.length > 0) {
        for (const s of this.selected) {
          const results = await this.getYelpPlaces(s, this.radius, this.sortBy);
          places.push(...results);
        }
      } else {
        const results = await this.getYelpPlaces(null, this.radius, this.sortBy);
        places.push(...results);
      }
      return this.getUsers(places)
    },
    async getYelpPlaces (term, radius, sortBy) {
      const mapLat = await this.map.center.lat();
      const mapLng = await this.map.center.lng();
      try {
        const response = await axios.get('/getYelpResults', {
          params: {
            lat: mapLat,
            lng: mapLng,
            offset: this.page * 25,
            term: term,
            radius: radius,
            sortBy: sortBy
          }
        })
        const list = response.data
        return list
      } catch (e) {
        console.log(e)
      }
    },
    async getUsers(places) {
      // Map the Firebase promises into an array
      const ids = places.map(p => p.id)
      try {
        const res = await axios.get('/getPlacesUsers', {
          params: {
            places: ids
          }
        })
        res.data.forEach((p, i) => {
          if (p) places[i].users = p.users
        });
        return places
      } catch (e) {
        console.log(e)
        return e
      }
    },
    async placeYelpMarkers() {
      const vm = this
      this.markers = []
      this.$emit('clearMarkers')
      gm.load(async (google) => {
        for (let i = 0; i < this.places.length; i++) {
          const markerLabel = this.places[i].users ? String(Object.keys(this.places[i].users).length) : '0'
          const markerIcon = this.places[i].users ? fullHeart : emptyHeart
          var MarkerWithLabel = require('markerwithlabel')(google.maps);
          this.markers[i] = new MarkerWithLabel({
            position: {lat: this.places[i].coordinates.latitude, lng: this.places[i].coordinates.longitude},
            labelContent:  markerLabel,
            icon: markerIcon,
            map: vm.map,
            labelAnchor: new google.maps.Point(15.5, 42),
            labelClass: "marker-label", // the CSS class for the label
          });
          this.markers[i].place = this.places[i];
          google.maps.event.addListener(this.markers[i], 'click', function() {
            vm.infoWindow.el.open(vm.map, this);
            vm.infoWindow.content = vm.places[i]
          });
        }
      });
      console.log('placed yelp markers')
    },
    getActivities(activities) {
      this.selected = activities;
    },
  },
  watch: {
    selected(){
      this.page = 0
    },
    markers(){
      this.$emit('emitMarkers', this.markers)
    },
  },
  components: {Accordion, ActivitySelect, Places}
};
</script>



