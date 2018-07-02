<template>
  <div class="c-my-gems">
    <ul class="c-my-gems__list">
      <li
        class="c-my-gem"
        v-for="(p, i) in places"
        :key="i"
        @mouseover="highlight(p, p.id, i)"
      >
        <div class="c-my-gem__cont">
        <div
          class="c-my-gem__img-container"
          :class="{'is-loading': loadingImgs[p.id]}"
        >
          <img
            v-show="!loadingImgs[p.id]"
            class="c-my-gem__img"
            :src="p.image_url"
            @load="imageLoaded(p.id)"
            alt="place-photo"/>
        </div>
          <div class="c-my-gem__details">
            <div class="c-my-gem__name">{{p.name}}</div>
            Shared by:
            <div v-if="p.users" v-for="(u, i) in p.users" :key="i">
              {{u.displayName}}
            </div>
          </div>
          <ul class="c-my-gem__btns">
            <li class="c-my-gem__btn">
              <a :href="p.url" target="_blank" class="c-btn c-btn--naked">
                Link
              </a>
            </li>
            <li class="c-my-gem__btn">
              <button
                :disabled="!user"
                class="c-btn c-btn--naked"
                @click.prevent="claimPlace(p)">
                Claim
              </button>
            </li>
          </ul>
        </div>
      </li>
    </ul>
    <button
      v-if="page >= 1 && !loading"
      @click.prevent="loadMore"
      class="c-btn"
    >
      Load More
    </button>
    <div v-if="page >= 1 && loading" class="spinner"></div>
  </div>
</template>

<script>

/* eslint-disable */
export default {
  name: 'Places',
  props: [
    'places',
    'claimPlace',
    'user',
    'page',
    'loading',
    'markers',
    'map',
    'infoWindow',
  ],
  data() {
    return {
      currentlyHighlighted: null,
      loadingImgs: {},
    };
  },
  methods: {
    highlight(p, id, idx) {
      if (this.currentlyHighlighted !== idx) {
        this.currentlyHighlighted = idx
        this.markers.forEach(m => {
          if (m.place.id === id) {
            this.infoWindow.el.open(this.map, m);
            this.infoWindow.content = p
          }
        });
      }
    },
    loadMore() {
      this.$emit('getPlaces');
    },
    imageLoaded(id) {
      this.$set(this.loadingImgs, id, false)
    },
  },
  watch: {
    places(list) {
      const keys = Object.keys(this.loadingImgs)
      list.map((p) => {
        if (!keys.includes(p.id)) {
          this.$set(this.loadingImgs, p.id, true)
        }
      })
    }
  },
};
</script>



