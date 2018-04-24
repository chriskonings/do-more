<template>
  <div class="iw">
    <table>
      <tr id="iw-url-row" class="iw_table_row">
        <td id="iw-url">
        {{name}}
        </td>
      </tr>
      <tr id="iw-phone-row" class="iw_table_row">
        <td id="iw-phone">{{phone}}</td>
      </tr>
      <tr id="iw-url-row" class="iw_table_row">
        <td id="iw-url">
          <a :href="url" target="_blank">Yelp link</a>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'Itinerary',
  props: ['name', 'phone', 'url'],
  mounted() {

  },
  methods: {

  },
};
</script>
<style lang="scss" scoped>

</style>





