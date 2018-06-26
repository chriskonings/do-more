<!-- Vue component -->
<template>
  <div>
    <label class="c-label">Activities</label>
    <multiselect v-model="value"
      :options="options"
      :multiple="true"
      :close-on-select="true"
      :clear-on-select="true"
      :hide-selected="false"
      :preserve-search="true"
      placeholder="Pick some"
      label="name"
      track-by="name"
      :preselect-first="false"
      :limit="3"
      :showLabels="true"
      class="c-multiselect-custom"
    >
      <div
       slot="tag"
       slot-scope="props"
       class="c-multiselect-custom__tag"
       >
        <span class="c-multiselect-custom__tag-name">
          {{ props.option.name }}
        </span>
        <span
          @click="props.remove(props.option)"
          class="c-multiselect-custom__tag-remove"
        >
          &#10005;
        </span>
      </div>
    </multiselect>
    <!-- <ul><li v-for="{ name, i } in value" :key="i">{{ name }}</li></ul> -->
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import activityList from './activityList.json';

export default {
  name: 'ActivitySelect',
  props: ['getActivities'],
  components: { Multiselect },
  data() {
    return {
      value: null,
      options: activityList.activities,
    };
  },
  watch: {
    value(newData) {
      const a = newData.map(s => s.name);
      this.$emit('getActivities', a);
    },
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
