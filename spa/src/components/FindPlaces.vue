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
      :claimPlace="claimPlace"
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
    'claimPlace',
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
      await this.buildList()
      await this.placeYelpMarkers(this.places)
      if (this.places.length >= 25) this.page += 1
      this.searching = false
    },
    async search() {
      this.page = 0
      await this.getPlaces()
    },
    async buildList () {
      const lastStatus = null;
      if (this.selected.length > 0) {
        for (let i = 0; i < this.selected.length; i++) {
          const places = await this.getYelpPlaces(this.selected[i], this.radius, this.sortBy);
          this.places.push(...places);
        }
      } else {
        const places = await this.getYelpPlaces(null, this.radius, this.sortBy);
        this.places.push(...places);
      }
    },
    async getYelpPlaces (term, radius, sortBy) {
      const mapLat = await this.map.center.lat();
      const mapLng = await this.map.center.lng();
      try {
        const response = await axios.get('/api', {
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
    getUsers(p, id) {
      const vm = this
      var placeRef = db.ref('finds').orderByChild('place/id').equalTo(id);
      placeRef.on('value', function(snapshot) {
        if (snapshot.val()) {
          for (var s in snapshot.val()) {
            var item = snapshot.val()[s];
            vm.$set(p, 'users', item.users);
          }
        }
      });
    },
    async placeYelpMarkers(list) {
      this.markers = []
      this.$emit('clearMarkers')
      const vm = this
      for (let i = 0; i < list.length; i++) {
        await this.getUsers(list[i], list[i].id)
        const markerLabel = list[i].users ? String(Object.keys(list[i].users).length) : String(0)
        const markerIcon = list[i].users ? fullHeart : emptyHeart
        gm.load((google) => {
          var MarkerWithLabel = require('markerwithlabel')(google.maps);
          vm.markers[i] = new MarkerWithLabel({
            position: {lat: list[i].coordinates.latitude, lng: list[i].coordinates.longitude},
            labelContent:  markerLabel,
            icon: markerIcon,
            map: vm.map,
            labelAnchor: new google.maps.Point(15.5, 42),
            labelClass: "marker-label", // the CSS class for the label
          });
        });
        vm.markers[i].place = list[i];
        google.maps.event.addListener(vm.markers[i], 'click', function() {
          vm.infoWindow.el.open(vm.map, this);
          vm.infoWindow.content = list[i]
        });
      }
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
    }
  },
  components: {Accordion, ActivitySelect, Places}
};
</script>



