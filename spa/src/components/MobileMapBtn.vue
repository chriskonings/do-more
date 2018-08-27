<template>
  <div class="c-map-btn">
    <button @click="fullscreen">Click</button>
  </div>
</template>

<script>

export default {
  name: 'MobileMapBtn',
  props: [],
  data() {
    return {};
  },
  methods: {
    fullscreen() {
      this.$emit('fullscreenMap')
    }
  },
  watch: { },
  computed: {

  },
};
</script>
