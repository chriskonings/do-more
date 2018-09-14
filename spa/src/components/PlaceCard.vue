<template>
  <li class="c-my-find">
    <div class="c-my-find__cont">
      <div
        class="c-my-find__img-container"
        :class="{'is-loading': loading}"
      >
        <img
          v-show="!loading"
          class="c-my-find__img"
          :src="place.image_url"
          @load="loaded"
          alt="place-photo"/>
      </div>
      <div class="c-my-find__details">
        <div class="c-my-find__name">{{place.name}}</div>
        <div v-if="place.city || place.country" class="c-my-find__loc">{{place.city}}, {{place.country}}</div>
        <div v-if="place.categories">
          For people who like
          <span v-for="(c, i) in place.categories" :key="i">
            {{c.title}}<span v-if="i != place.categories.length - 1">, </span>
          </span>
        </div>
        <div v-if="place.distance">{{calcDistance}}</div>
        <template v-if="users">
          <div v-for="(u, i) in users" :key="i">
            <div
              class="c-my-find__user-icon"
              :title="u.displayName"
              :style="{ 'background-image': 'url(' + u.photoURL + ')' }">
            </div>
          </div>
        </template>
      </div>
      <ul class="c-my-find__btns">
        <li class="c-my-find__btn">
          <button
            class="c-btn c-btn--naked"
            @click.prevent="panToPlace">
            Go to
          </button>
        </li>
        <li class="c-my-find__btn">
          <a
            :href="place.url"
            target="_blank"
            class="c-btn c-btn--naked">
            Link
          </a>
        </li>
        <li  class="c-my-find__btn">
          <button
            v-if="isSaved"
            class="c-btn c-btn--naked"
            @click.prevent="trash">
            Unsave
          </button>
          <button
            v-else
            :disabled="!user"
            class="c-btn c-btn--naked"
            @click.prevent="save()">
            Save
          </button>
        </li>
      </ul>
    </div>
  </li>
</template>

<script>

export default {
  name: 'PlaceCard',
  props: [
    'user',
    'loading',
    'place',
    'users',
    'identifier',
  ],
  data() {
    return {};
  },
  methods: {
    loaded() {
      this.$emit('loaded');
    },
    save() {
      this.$emit('save');
    },
    async trash() {
      this.$emit('trash');
    },
    mouseover() {
      this.$emit('hover');
    },
    panToPlace() {
      console.log('pan')
      this.$emit('panToPlace');
    },
  },
  watch: { },
  computed: {
    isSaved() {
      return this.users && this.users[this.user.uid];
    },
    calcDistance() {
      const miles = Math.round( this.place.distance * 0.000621371192 ) / 10
      const yards = Math.round( this.place.distance * 1.0936 )
      if (miles <= 0) {
        return yards + ' yards'
      } else {
        return miles + ' miles'
      }
    },
  },
};
</script>
