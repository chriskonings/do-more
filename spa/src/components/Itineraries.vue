<template>
  <div class="c-itineraries">
    <ul class="c-itineraries__list">
      <li class="c-itineraries__card" v-for="(itn, i) of itineraries" :key="i">
        <h3 class="c-itineraries__card-title">{{itn.name}}</h3>
        <button class="c-btn c-btn--link" @click="itineraryPlaces(itn)">Get places</button>
        <button class="c-btn c-btn--link" @click="rmItinerary(itn)">Delete</button>
      </li>
    </ul>
    <div class="c-itineraries__add">
      <button
        @click.prevent="adding = true"
        v-if="!adding"
        class="c-itineraries__add-btn"
        :class="{'c-itineraries__add-btn--active': adding}"
        name="add-itinerary"
      >
        <svg class="c-itineraries__add-btn-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" height="30" viewBox="0 0 30 30"><path d="M12 0h6v30h-6z"/><path d="M30 12v6H0v-6z"/></svg>
      </button>
      <form v-else class="c-form u-txt-left">
        <div class="c-form__item">
          <label class="c-label">Itinerary name</label>
          <input v-model="itinerary.name" class="c-text-input" placeholder="My trip"/>
        </div>
        <div class="c-form__item">
          <button @click.prevent="addItinerary" class="c-btn" type="submit">Add</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { db } from '../firebase';

export default {
  name: 'Itineraries',
  props: ['user', 'itineraries'],
  data() {
    return {
      adding: false,
      itinerary: {
        name: null,
        user: this.user && this.user.uid,
      },
      places: [],
    };
  },
  methods: {
    async itineraryPlaces(i) {
      const id = i['.key'];
      console.log(id)
      await this.$bindAsArray('places', db.ref('places').orderByChild('itinerary').equalTo(id));
      this.$emit('getPlaces', this.places);
    },
    addItinerary() {
      db.ref().child('itineraries').push(this.itinerary)
    },
    rmItinerary(itinerary) {
      const key = itinerary['.key'];
      const ref = this.$firebaseRefs.itineraries.child(key);
      ref.remove()
        .then(() => {
          console.log('Remove succeeded.');
        })
        .catch((error) => {
          console.log('Remove failed: ', error.message);
        });
    },
  },
};
</script>
