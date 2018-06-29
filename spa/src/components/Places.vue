<template>
  <div class="c-my-gems">
    <ul class="c-my-gems__list">
      <li class="c-my-gem" v-for="(p, i) in places" :key="i" @mouseover="highlight(p, p.id)">
        <div class="c-my-gem__cont">
          <div
            class="c-my-gem__img"
            :style="{ 'background-image': 'url(' + p.image_url + ')' }">
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
                @click.prevent="addToItinerary(p)">
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
    'addToItinerary',
    'user',
    'page',
    'loading',
    'markers',
    'map',
    'infoWindow',
  ],
  data() {
    return {
    };
  },
  methods: {
    highlight(p, id) {
      this.markers.forEach(m => {
        if (m.place.id === id) {
          this.infoWindow.el.open(this.map, m);
          this.infoWindow.content = p
        }
      });
    },
    loadMore() {
      this.$emit('getPlaces');
    },
  },
  watch: {

  },
};
</script>



