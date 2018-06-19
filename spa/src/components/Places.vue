<template>
  <div class="c-itinerary">
    <ul class="c-my-gems__list">
      <li class="c-my-gem" v-for="(p, i) in places" :key="i">
        <div class="c-my-gem__cont">
          <div class="c-my-gem__img" :style="{ 'background-image': 'url(' + p.image_url + ')' }"></div>
          <div class="c-my-gem__details">
            <div class="c-my-gem__name">{{p.name}}</div>
            Shared by:  <div v-if="p.users" v-for="u in p.users">{{u.displayName}}</div>
          </div>
          <ul class="c-my-gem__btns">
            <li class="c-my-gem__btn">
              <a :href="p.url" target="_blank" class="c-btn c-btn--naked">Link</a>
            </li>
            <li class="c-my-gem__btn">
              <button :disabled="!user" class="c-btn c-btn--naked" @click.prevent="addToItinerary(p)">
                Claim
              </button>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>

/* eslint-disable */
export default {
  name: 'Places',
  props: ['places', 'addToItinerary', 'user'],
  data() {
    return {
    };
  },
  methods: {

  },
  watch: {

  },
};
</script>



