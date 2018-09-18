<template>
  <div>
    <button
      @click="getLocation(true)"
      class="c-btn c-btn--naked"
    >
      Get location
    </button>
    <LocationSearch
      class="c-form__item"
      :map="map"
      :google="google"
    />
    <Accordion label="Filter">
      <!-- <ActivitySelect
        @getActivities="getActivities"
      /> -->
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
    <div v-if="!places" class="no-places">
      <svg class="no-places__icon" width="100" height="99" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><ellipse fill="#DCDCDC" fill-rule="nonzero" cx="50" cy="50" rx="50" ry="50"/><path d="M100 50c0-10.032-2.954-19.373-8.04-27.202 0 0-2.852 4.167-2.316 6.845.535 2.679 3.682 2.883 3.359 4.848-.323 1.965-2.645-.562-5.502 4.616-2.858 5.178-1.429 12.323 2.678 12.858C94.286 52.499 100 50 100 50zM63.13 1.742A49.785 49.785 0 0 1 79.12 9.35s-5.798-.956-7.994 1.007c-2.197 1.964-5.4 6.608-7.994 0-2.595-6.607 0-8.615 0-8.615zM50 0s-3.392 2.054 3.036 5.536c6.429 3.482 3.482 5.09 2.143 6.16C53.84 12.769 51.517 9.555 50 7.412c-1.517-2.143-8.034-5.446-13.034-3.66-5 1.786-9.285 3.106-8.571 4.767.713 1.662 9.285-1.551 12.499-1.374 3.214.178 2.143 2.142-.892 4.464-3.036 2.322-3.394 5.179-.18 6.964 3.215 1.786 7.142 1.965 8.036.894.894-1.072-1.607-8.036 4.465-5 6.072 3.035 11.072 4.822 6.072 9.286-5 4.463-10.715 9.465-10.894 12.32-.179 2.857 1.787 5.18.715 5.358-1.071.178-2.055-1.16-2.769-2.143-.713-.982-4.017-1.339-5.624-.715-1.608.625-4.644 3.036-2.947 5.357 1.697 2.323 4.017 1.25 6.339 2.321 2.322 1.072 4.487 5.15 4.042 6.071-.445.922-2.424-.245-4.042-3.392-1.62-3.147-4.655-1.071-6.792-1.607-2.136-.536-3.744-.893-5.886-4.643-2.143-3.75-6.58-4.8-8.393-6.964-5.193-6.201-4.822-10.893-5.893-13.036-1.071-2.143-3.845-5.644-3.845-5.644C21.57 6.593 35.015 0 50 0zM54.821 50.714s5.358.535 8.036 2.857c2.679 2.322 3.036 3.215 7.143 4.108 4.107.892 5.893 3.213 3.214 7.678-2.678 4.464-7.5 11.607-9.821 13.75-2.32 2.143-5.178 3.929-6.25 7.5-1.071 3.571-1.429 5.713.893 7.142 0 0-1.25 3.037-4.107-.892-2.858-3.93-.536-8.571 0-11.25.536-2.678 1.964-10.713 1.071-12.679-.892-1.964-5-3.215-6.071-7.321-1.072-4.107.803-12.099 5.892-10.893z" fill="#ADADAD" fill-rule="nonzero"/><path d="M50 100c27.614 0 50-22.386 50-50s-22.386-7-50-7S0 22.386 0 50s22.386 50 50 50z" fill-opacity=".1" fill="#3E3E3E" fill-rule="nonzero"/><circle fill="#FFF" cx="33" cy="63" r="5"/><circle fill="#FFF" cx="67" cy="63" r="5"/><path d="M32 83.75c11.677-9 23.355-9 35.032 0" stroke="#FFF" stroke-width="4" stroke-linecap="round"/></g></svg>
      <h4>No Results</h4>
    </div>
    <Places
      v-if="places && places.length >= 1"
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
    <div v-else-if="!searching && (places && places.length <= 0)">
      No Results
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { db } from '../firebase';
import axios from 'axios'
import ActivitySelect from './ActivitySelect';
import Accordion from './Accordion'
import Places from './Places'
import LocationSearch from './LocationSearch';

export default {
  name: 'FindPlaces',
  props: [
    'infoWindow',
    'radius',
    'map',
    'savePlace',
    'markers',
    'google'
  ],
  data() {
    return {
      page: 0,
      places: [],
      selected: [],
      searching: false,
      places: null,
      sortBy: 'distance'
    };
  },
  methods: {
    getLocation(bool) {
      this.$emit('getLocation', bool)
    },
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
      if (list) {
        this.places.push(...list)
        this.placeYelpMarkers()
        if (this.places.length >= 25) this.page += 1
      }
      this.searching = false
    },
    async search() {
      this.page = 0
      await this.getPlaces()
    },
    async buildList () {
      let places = []
      const lastStatus = null;
      if (this.user.interests.length >= 1) {
        const interests = this.user.interests.map(i => i.alias)
        const results = await this.getYelpPlaces(interests.toString(), this.radius, this.sortBy);
        places.push(...results);
      } else {
        const results = await this.getYelpPlaces(null, this.radius, this.sortBy);
        places.push(...results);
      }
      if(places.length >= 1) {
        return this.getUsers(places)
      } else {
        return null
      }
    },
    async getYelpPlaces (categories, radius, sortBy) {
      const mapLat = await this.map.center.lat();
      const mapLng = await this.map.center.lng();
      try {
        const response = await axios.get('/getYelpResults', {
          params: {
            lat: mapLat,
            lng: mapLng,
            offset: this.page * 25,
            categories: categories,
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
    // getActivities(activities) {
    //   this.selected = activities;
    // },
  },
  watch: {
    user: {
      handler: () => {
        this.page = 0
      },
      deep: true
    }
  },
  computed:{
    user() {
      return this.$store.state.user
    },
  },
  components: {
    Accordion,
    ActivitySelect,
    Places,
    LocationSearch
  }
};
</script>
<style lang="scss" scoped>
  .no-places {
    display: flex;
    margin: 3rem auto;
    justify-content: center;
    flex-flow: column;
    align-items: center;
  }

  .no-places__icon {
    opacity: .6;
  }
</style>




