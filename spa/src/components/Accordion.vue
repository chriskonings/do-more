<template>
  <div class="c-accordion">
    <button
      @click.prevent="isOpen = !isOpen"
      class="c-accordion__btn" :class="{'is-active': isOpen}"
    >
      {{label}}
    </button>
    <transition name="slide">
    <div
      v-show="isOpen"
      class="c-accordion__drawer"
      :class="{'is-active': isOpen}"
    >
      <slot></slot>
    </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Accordion',
  props: ['label'],
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {

  },
};
</script>
