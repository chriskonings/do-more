<template>
  <div class="c-my-finds">
    <div class="c-my-finds__title">
      <p>Popular places being shared</p>
    </div>
    <div v-if="loading" class="spinner"></div>
    <ul v-else class="c-my-finds__list">
      <li class="c-my-find" v-for="(g, i) in sortedFinds" :key="i">
        <div class="c-my-find__cont">
          <div
            class="c-my-find__img-container"
            :class="{'is-loading': loadingImgs[g.place.id]}"
          >
            <img
              v-show="!loadingImgs[g.place.id]"
              class="c-my-find__img"
              :src="g.place.image_url"
              @load="imageLoaded(g.place.id)"
              alt="place-photo"/>
          </div>
          <div class="c-my-find__details">
            <div class="c-my-find__name">{{g.place.name}}</div>
            <div class="c-my-find__loc">{{g.place.city}}, {{g.place.country}}</div>
            <template v-if="g.users">
              <div v-for="(u, i) in g.users" :key="i">
                <div :title="u.displayName" class="c-my-find__user-icon" :style="{ 'background-image': 'url(' + u.photoURL + ')' }">
                </div>
              </div>
            </template>
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
                :disabled="!user"
                class="c-btn c-btn--naked"
                @click.prevent="savePlace(g)">
                Save
              </button>
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
  name: 'HotList',
  props: ['savePlace', 'user'],
  data() {
    return {
      loading: false,
      finds: [],
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
      this.$bindAsArray('finds', db.ref('finds'), null, () => this.loading = false)
    },
    imageLoaded(id) {
      this.$set(this.loadingImgs, id, false)
    },
  },
  watch: {
    finds(list) {
      const keys = Object.keys(this.loadingImgs)
      list.map((g) => {
        if (!keys.includes(g.place.id)) {
          this.$set(this.loadingImgs, g.place.id, true)
        }
      })
    }
  },
  computed: {
    sortedFinds: function() {
      function compareUserCount(a, b) {
        const aUsers = a.users ? Object.keys(a.users).length : 0
        const bUsers = b.users ? Object.keys(b.users).length : 0
        if (aUsers < bUsers) {
          return 1;
        } else {
          return -1;
        }
      }
      return this.finds.sort(compareUserCount);
    }
  }
};
</script>



