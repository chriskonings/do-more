<template>
  <div class="c-itinerary">
    <ul class="c-my-gems">
      <li class="c-my-gem" v-for="(g, i) in gems" :key="i">
        <div class="c-my-gem__cont">
          <div class="c-my-gem__img" :style="{ 'background-image': 'url(' + g.place.image_url + ')' }"></div>
          <div class="c-my-gem__details">
            <div class="c-my-gem__name">{{g.place.name}}</div>
            <div class="c-my-gem__loc">{{g.place.city}}, {{g.place.country}}</div>
          </div>
          <ul class="c-my-gem__btns">
            <li class="c-my-gem__btn">
              <a :href="g.place.link" target="_blank" class="c-btn c-btn--naked">Link</a>
            </li>
            <li class="c-my-gem__btn">
              <button @click="deleting = i" class="c-btn c-btn--naked">Trash</button>
            </li>
          </ul>
        </div>
        <div v-if="deleting === i" class="c-my-gem__delete">
          Are you sure you want to delete this gem?
          <div class="c-my-gem__delete-btns">
            <button @click="deleteGem(g)" class="c-btn c-btn--naked">Yes</button>
            <button @click="deleting = null" class="c-btn c-btn--naked">No</button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { db } from '../firebase';

/* eslint-disable */
export default {
  name: 'MyGems',
  props: ['user'],
  data() {
    return {
      gems: [],
      deleting: null,
    };
  },
  async mounted() {
    this.$bindAsArray('gems', db.ref('gems').orderByChild('users/' + this.user.uid));
  },
  methods: {
    deleteGem (g) {
      const key = g['.key'];
      const ref =  db.ref().child('gems').child(key);
      ref.remove()
        .then(() => {
          console.log('Remove succeeded.');
        })
        .catch((error) => {
          console.log('Remove failed: ', error.message);
        });
    }
  },
};
</script>



