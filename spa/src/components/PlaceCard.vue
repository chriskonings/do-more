<template>
  <li class="c-my-find" @mouseover="mouseover">
    <div class="c-my-find__cont">
      <div
        class="c-my-find__img-container"
        :class="{'is-loading': loading}"
      >
        <img
          v-show="!loading"
          class="c-my-find__img"
          :src="icon"
          @load="loaded"
          alt="place-photo"/>
      </div>
      <div class="c-my-find__details">
        <div class="c-my-find__name">{{name}}</div>
        <div v-if="city || country" class="c-my-find__loc">{{city}}, {{country}}</div>
        <template v-if="users">
          <div v-for="(u, i) in users" :key="i">
            <div :title="u.displayName" class="c-my-find__user-icon" :style="{ 'background-image': 'url(' + u.photoURL + ')' }">
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
            :href="link"
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
import axios from 'axios'

/* eslint-disable */
export default {
  name: 'PlaceCard',
  props: [
    'user',
    'loading',
    'icon',
    'name',
    'city',
    'link',
    'country',
    'users',
    'identifier',
    'trashable',
  ],
  data() {
    return {
      trashing: false
    };
  },
  methods: {
    loaded() {
      this.$emit('loaded')
    },
    save() {
      this.$emit('save')
    },
    async trash() {
      this.$emit('trash')
    },
    mouseover() {
      this.$emit('hover')
    },
    panToPlace() {
      this.$emit('panToPlace')
    },
  },
  watch: { },
  computed: {
    isSaved() {
      return this.users && this.users[this.user.uid]
    }
  }
};
</script>



