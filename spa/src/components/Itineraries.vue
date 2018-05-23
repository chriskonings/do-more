<template>
  <div class="c-itineraries">
    <button
      @click="adding = true"
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
        <button class="c-btn" type="submit">Add</button>
      </div>
    </form>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'Itineraries',
  props: [],
  data() {
    return {
      adding: false,
      itinerary: {
        name: null
      }
    }
  },
  methods: {
    addItinerary() {
      this.adding = true;
    }
  },
};
</script>




