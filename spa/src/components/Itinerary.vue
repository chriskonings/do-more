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
  props: ['places', 'user', 'gMapsLoader'],
  data() {
    return {
      dbPlaces: null,
    };
  },
  async mounted() {
    this.placeMarkers()
  },
  methods: {
    placeMarkers() {
      const list = this.places
      console.log(list)
      // this.gMapsLoader.load((google) => {
      //   for (let i = 0; i < list.length; i++) {
      //     vm.markers[i] = new google.maps.Marker({
      //       position: {lat: list[i].coordinates.latitude, lng: list[i].coordinates.longitude},
      //       icon: utils.pinSymbol('red')
      //     });
      //     vm.markers[i].placeResult = list[i];
      //     google.maps.event.addListener(vm.markers[i], 'click', function() {
      //       console.log(list[i])
      //       vm.infoWindow.el.open(vm.map, this);
      //       vm.infoWindow.content = list[i]
      //     });
      //     vm.markers[i].setMap(vm.map);
      //   }
      // })
      // if (this.markers.length >= 1) {
      //   this.panMap(google);
      // }
    },
    getPlace(p) {
      console.log(p)
    },
    rmPlace (p) {
      const key = p['.key'];
      const ref =  db.ref().child('places').child(key);
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




