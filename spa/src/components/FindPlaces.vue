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
      @deletePlace="deletePlace"
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
import axios from 'axios'
import ActivitySelect from './ActivitySelect';
import Accordion from './Accordion'
import Places from './Places'

export default {
  name: 'FindPlaces',
  props: [
    'infoWindow',
    'radius',
    'map',
    'savePlace',
    'user',
    'markers'
  ],
  data() {
    return {
      page: 0,
      places: [],
      selected: [],
      searching: false,
      places: null,
      sortBy: 'best_match'
    };
  },
  methods: {
    deletePlace(place, key) {
      db.ref('finds/' + key)
        .child('users')
        .child(this.user.uid).remove()
        .then(() => {
          console.log('Remove succeeded.');
        })
        .catch((error) => {
          console.log('Remove failed: ', error.message);
        });
      db.ref('users/' + this.user.uid)
        .child('saved/' + key)
        .set(false)
        .then(() => {
          console.log('Remove succeeded.');
        })
        .catch((error) => {
          console.log('Remove failed: ', error.message);
        });
      this.$delete(place.users, this.user.uid)
      this.$set(this.user.saved, key, false)
      const m = this.$utils.newMarker(
        place,
        place.users,
        this.map,
        this.infoWindow,
        this.markers
      )
      this.$emit('createMarker', m)
    },
    async getPlaces() {
      this.searching = true
      if (this.page === 0) this.places = []
      const list = await this.buildList()
      this.places.push(...list)
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
      const ids = places.map(p => p.id)
      try {
        const res = await axios.get('/getPlaceUsers', {
          params: {
            places: ids
          }
        })
        const users = res.data
        const placesWithUsers = places.map((place, i) => {
          place.users = users[i]
          return place
        });
        return placesWithUsers
      } catch (e) {
        console.log(e)
        return e
      }
    },
    async placeYelpMarkers() {
      const vm = this
      this.$emit('clearMarkers')
      for (let i = 0; i < this.places.length; i++) {
        const m = this.$utils.newMarker(
          this.places[i],
          this.places[i].users,
          this.map,
          this.infoWindow,
          this.markers
        )
        this.$emit('createMarker', m)
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
  },
  components: {Accordion, ActivitySelect, Places}
};
</script>



