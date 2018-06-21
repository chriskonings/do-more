<template>
  <div>
    <Accordion label="Filter">
      <ActivitySelect
        @getActivities="getActivities"
      />
      <div>
        <label>Order by:</label>
        <select v-model="sortBy">
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
        @click.prevent="getPlaces"
        class="c-btn"
      >
        Search
      </button>
    </div>
    <Places
      v-if="places"
      :places="places"
      :addToItinerary="addToItinerary"
      :user="user"
      :page="page"
      @getPlaces="nextPage"
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

function sortThenLimit (arr, limit) {
  const sort = arr.sort(function (a, b) {
    return b.rating - a.rating;
  });
  return sort.slice(0, limit)
}

export default {
  name: 'FindPlaces',
  props: [
    'infoWindow',
    'radius',
    'map',
    'addToItinerary',
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
      limit: 25,
      sortBy: 'best_match'
    };
  },

  methods: {
    async getPlaces() {
      this.searching = true
      const fullResults = await this.buildList()
      await this.placeYelpMarkers(fullResults)
      const listWithUsers = await this.getUsers(fullResults)
      this.page === 0 ? this.places = listWithUsers : this.places.push(...listWithUsers)
      if (fullResults.length >= 25) this.page += 1
      this.searching = false
    },
    nextPage() {
      this.getPlaces()
    },
    async buildList () {
      const lastStatus = null;
      const list = [];
      if (this.selected.length > 0) {
        for (let i = 0; i < this.selected.length; i++) {
          const places = await this.getYelpPlaces(this.selected[i], this.radius, this.sortBy);
          list.push(...places);
        }
      } else {
        const places = await this.getYelpPlaces(null, this.radius, this.sortBy);
        list.push(...places);
      }
      return list;
    },
    async getYelpPlaces (term, radius, sortBy) {
      const mapLat = await this.map.center.lat();
      const mapLng = await this.map.center.lng();
      try {
        console.log(this.page * 25)
        const response = await axios.get(`/api`, {
          params: {
            lat: mapLat,
            lng: mapLng,
            limit: 25,
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
    getUsers(places) {
      const vm = this
      places.forEach(p => {
        var placeRef = db.ref('gems').orderByChild('place/id').equalTo(p.id);
        placeRef.on('value', function(snapshot) {
          if (snapshot.val()) {
            for (var s in snapshot.val()) {
              var item = snapshot.val()[s];
              vm.$set(p, 'users', item.users);
            }
          }
        });
      });
      return places
    },
    async placeYelpMarkers(list) {
      this.markers = []
      this.$emit('clearMarkers')
      const vm = this
      for (let i = 0; i < list.length; i++) {
        vm.markers[i] = new google.maps.Marker({
          position: {lat: list[i].coordinates.latitude, lng: list[i].coordinates.longitude},
          icon: utils.pinSymbol('#D65745')
        });
        vm.markers[i].placeResult = list[i];
        google.maps.event.addListener(vm.markers[i], 'click', function() {
          vm.infoWindow.el.open(vm.map, this);
          vm.infoWindow.content = list[i]
        });
        vm.markers[i].setMap(vm.map);
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
    limit(l) {
      if (l > 50) {
        this.limit = 50
      }
    },
    markers(){
      this.$emit('emitMarkers', this.markers)
    }
  },
  components: {Accordion, ActivitySelect, Places}
};
</script>



