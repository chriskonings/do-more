<template>
  <div class="c-my-gems">
    <div class="c-my-gems__title">
      <p>Popular places being shared</p>
    </div>
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
            <div>Shared by:</div>
            <div v-if="g.users" v-for="(u, i) in g.users" :key="i">
              {{u.displayName}}
            </div>
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
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { db } from '../firebase';

/* eslint-disable */
export default {
  name: 'Finds',
  props: [],
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
      this.$bindAsArray('gems', db.ref('gems'), null, () => this.loading = false)
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



