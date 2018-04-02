<template>
  <div class="hello-world">
    <Search :options="dbActivities" @getActivities="getActivities"/>
    <GoogleMaps :selected="selectedActiv"/>
  </div>
</template>

<script>
import Search from './Search';
import { db } from '../main';
import GoogleMaps from './GoogleMaps';

export default {
  name: 'HelloWorld',
  data() {
    return {
      selectedActiv: [],
      dbActivities: [],
    };
  },
  firestore() {
    return {
      dbActivities: db.collection('activities'),
    };
  },
  methods: {
    getActivities(activities) {
      const selectedArr = [];
      activities.forEach((activity) => {
        selectedArr.push(activity.name);
      });
      this.selectedActiv = selectedArr;
    },
  },
  components: { Search, GoogleMaps },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
