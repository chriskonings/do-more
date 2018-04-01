<template>
  <div class="hello">
    <Search :options="activities"/>
    <Gmap />
  </div>
</template>

<script>
import Search from './Search';
import Gmap from './Gmap';
import { db } from '../main';

export default {
  name: 'HelloWorld',
  data() {
    return {
      activities: [],
    };
  },
  firestore() {
    return {
      activities: db.collection('activities'),
    };
  },
  components: { Search, Gmap },
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
