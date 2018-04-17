<!-- Vue component -->
<template>
  <div>
    <label>Simple select / dropdown</label>
    <multiselect v-model="value"
      :options="options"
      :multiple="true"
      :close-on-select="true"
      :clear-on-select="true"
      :hide-selected="true"
      :preserve-search="true"
      placeholder="Pick some"
      label="name"
      track-by="name"
      :preselect-first="false"
    >
      <template slot="tag" slot-scope="props"><span>
        <span>{{ props.option.name }}</span>
        <span class="custom__remove" @click="props.remove(props.option)">❌</span>
        </span>
      </template>
    </multiselect>
    <!-- <ul><li v-for="{ name, i } in value" :key="i">{{ name }}</li></ul> -->
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';

export default {
  name: 'Search',
  props: ['options', 'getActivities'],
  components: { Multiselect },
  data() {
    return {
      value: null,
    };
  },
  watch: {
    value(newData) {
      this.$emit('getActivities', newData);
    },
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style>
</style>
