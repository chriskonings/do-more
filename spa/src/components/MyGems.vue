<template>
  <div class="c-my-gems">
    <div v-if="loading" class="spinner"></div>
    <ul v-else class="c-my-gems__list">
      <li class="c-my-gem" v-for="(g, i) in gems" :key="i">
        <div class="c-my-gem__cont">
          <div
            class="c-my-gem__img-container"
            :class="{'is-loading': loadingImgs[g.place.id]}"
          >
            <img
              v-show="!loadingImgs[g.place.id]"
              class="c-my-gem__img"
              :src="g.place.image_url"
              @load="imageLoaded(g.place.id)"
              alt="place-photo"/>
          </div>
          <div class="c-my-gem__details">
            <div class="c-my-gem__name">{{g.place.name}}</div>
            <div class="c-my-gem__loc">{{g.place.city}}, {{g.place.country}}</div>
          </div>
          <ul class="c-my-gem__btns">
            <li class="c-my-gem__btn">
              <a
                :href="g.place.link"
                target="_blank"
                class="c-btn c-btn--naked">
                Link
              </a>
            </li>
            <li class="c-my-gem__btn">
              <button
                @click="deleting = i"
                class="c-btn c-btn--naked">
                Trash
              </button>
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
      loading: false,
      gems: [],
      deleting: null,
      loadingImgs: {},
    };
  },
  async mounted() {
    await this.getGems()
  },
  methods: {
    async getGems() {
      this.loading = true;
      this.$bindAsArray('gems', db.ref('gems').orderByChild('users/' + this.user.uid), null, () => this.loading = false)
    },
    deleteGem(g) {
      const key = g['.key'];
      const ref =  db.ref().child('gems').child(key);
      ref.remove()
        .then(() => {
          console.log('Remove succeeded.');
        })
        .catch((error) => {
          console.log('Remove failed: ', error.message);
        });
    },
    imageLoaded(id) {
      this.$set(this.loadingImgs, id, false)
    },
  },
  watch: {
    gems(list) {
      const keys = Object.keys(this.loadingImgs)
      list.map((g) => {
        if (!keys.includes(g.place.id)) {
          this.$set(this.loadingImgs, g.place.id, true)
        }
      })
    }
  },
};
</script>



