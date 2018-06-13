<template>
  <div class="c-itinerary">
    <button class="c-btn c-btn--link" @click="back">back</button>
    <ul class="c-places">
      <li class="c-places__place" v-for="(p, i) in places" :key="i">
        <img class="c-places__place-img" :src="p.place.image_url"/>
        <span class="c-places__place-name">{{p.place.name}}</span>
        <div class="c-places__place-btns">
          <button class="c-btn c-btn--link" @click="rmPlace(p)">Delete</button>
          <button class="c-btn c-btn--link" @click="getPlace(p)">Get Place</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { db } from '../firebase';

/* eslint-disable */
export default {
  name: 'Itinerary',
  props: ['places', 'user'],
  firebase() {
    return {
      dbPlaces: {
        source: db.ref('places').orderByChild('user').equalTo(this.user.uid),
      },
    };
  },
  methods: {
    getPlace(p) {
      console.log(p)
    },
    rmPlace (p) {
      const key = p['.key'];
      console.log(key)
      const ref = this.$firebaseRefs.dbPlaces.child(key);
      ref.remove()
        .then(() => {
          console.log('Remove succeeded.');
        })
        .catch((error) => {
          console.log('Remove failed: ', error.message);
        });
    },
    back () {
      this.$emit('getItineraries')
    }
  },
};
</script>
<style lang="scss" scoped>
  .c-places {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .c-places__place {
    display: flex;
    min-height: 5rem;
    background: #efefef;
    padding: 1rem;
  }
  .c-places__place-img {
    display: flex;
  }
  .c-places__place-name {
    flex: 1;
    font-size: 1.2rem;
  }
  .c-places__place-btns {
    display: flex;
  }
</style>




