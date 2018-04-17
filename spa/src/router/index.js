import Vue from 'vue';
import Router from 'vue-router';
import Initial from '@/components/Initial';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Initial',
      component: Initial,
    },
  ],
});
