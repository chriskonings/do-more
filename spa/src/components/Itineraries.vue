<template>
  <div class="c-itineraries">
    <button
      @click.prevent="adding = true"
      v-if="!adding"
      class="c-itineraries__add"
      :class="{'c-itineraries__add--active': adding}"
      name="add-itinerary"
    >
      <svg class="c-itineraries__add-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" height="30" viewBox="0 0 30 30"><path d="M12 0h6v30h-6z"/><path d="M30 12v6H0v-6z"/></svg>
    </button>
    <form v-else class="c-form">
      <div class="c-form__item">
        <label class="c-label">Itinerary name</label>
        <input v-model="itinerary.name" class="c-text-input" placeholder="My trip"/>
      </div>
      <div class="c-form__item">
        <button @click.prevent="addItinerary" class="c-btn" type="submit">Add</button>
      </div>
    </form>
    <ul>
      <li v-for="(itn, i) of itineraries" :key="i">
        {{itn.name}}
      </li>
    </ul>
  </div>
</template>

<script>
import { db } from '../firebase';

export default {
  name: 'Itineraries',
  props: ['user'],
  data() {
    return {
      itineraries: [],
      adding: false,
      itinerary: {
        name: null,
        user: this.user.uid,
      },
    };
  },
  firebase() {
    return {
      itineraries: db.ref('itineraries').orderByChild('user').equalTo(this.user.uid),
    };
  },
  methods: {
    addItinerary() {
      this.$firebaseRefs.itineraries.push(this.itinerary);
    },
  },
};
</script>
