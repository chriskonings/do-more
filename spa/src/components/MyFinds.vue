<template>
  <div class="c-my-finds">
    <div class="c-my-finds__title">
      <p>Places you have discovered</p>
    </div>
    <div v-if="loading" class="spinner"></div>
    <ul v-else class="c-my-finds__list">
      <li class="c-my-find" v-for="(g, k) in finds" :key="k">
        <div class="c-my-find__cont">
          <div
            class="c-my-find__img-container"
            :class="{'is-loading': loadingImgs[k]}"
          >
            <img
              v-show="!loadingImgs[k]"
              class="c-my-find__img"
              :src="g.place.image_url"
              @load="imageLoaded(k)"
              alt="place-photo"/>
          </div>
          <div class="c-my-find__details">
            <div class="c-my-find__name">{{g.place.name}}</div>
            <div class="c-my-find__loc">{{g.place.city}}, {{g.place.country}}</div>
          </div>
          <ul class="c-my-find__btns">
            <li class="c-my-find__btn">
              <a
                :href="g.place.link"
                target="_blank"
                class="c-btn c-btn--naked">
                Link
              </a>
            </li>
            <li class="c-my-find__btn">
              <button
                @click="deleting = k"
                class="c-btn c-btn--naked">
                Trash
              </button>
            </li>
          </ul>
        </div>
        <div v-if="deleting === k" class="c-my-find__delete">
          Are you sure you want to delete this find?
          <div class="c-my-find__delete-btns">
            <button @click="deletefind(k)" class="c-btn c-btn--naked">Yes</button>
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
  name: 'Myfinds',
  props: ['user'],
  data() {
    return {
      loading: false,
      finds: {},
      deleting: null,
      loadingImgs: {},
    };
  },
  async mounted() {
    await this.getfinds()
  },
  methods: {
    async getfinds() {
      this.loading = true;
      for (const key in this.user.saved) {
        db.ref('finds/' + key).once('value').then((snap) => {
          this.$set(this.finds, key, snap.val())
          this.$set(this.loadingImgs, key, true)
        });
      }
      this.loading = false;
    },
    deletefind(key) {
      console.log(this.user.uid)
      db.ref('finds/' + key).child('users').child(this.user.uid).remove()
      db.ref('users/' + this.user.uid).child('saved').child(key).remove()
      this.$delete(this.finds, key)
      // const ref =  db.ref().child('finds').child(key);
      // ref.remove()
      //   .then(() => {
      //     console.log('Remove succeeded.');
      //   })
      //   .catch((error) => {
      //     console.log('Remove failed: ', error.message);
      //   });
    },
    imageLoaded(key) {
      this.$set(this.loadingImgs, key, false)
    },
  },
};
</script>



