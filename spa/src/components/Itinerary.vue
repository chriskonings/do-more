<template>
  <div class="c-itinerary">
    <b>Itinerary</b>
    <ul>
      <li v-for="(p, i) in places" :key="i">
        <h4>{{p.name}}</h4>
      </li>
    </ul>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'Itinerary',
  props: ['places'],
  mounted() {

},
  methods: {

  },
};
</script>
<style lang="scss" scoped>

</style>




