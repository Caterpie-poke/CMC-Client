<template>
  <div id="app">
    <Navibar/>
    <button class="btn btn-primary" v-on:click="test()">BTN</button>
  </div>
</template>

<script>
// import section
import Navibar from './components/Navibar.vue'

// require section

// vue setting section
export default {
  name: 'app',
  components: {
    Navibar,
  },
  methods: {
    print,
  }
}

// function section
function print(s) {
  /* eslint-disable-next-line */
  console.log(s);
}


</script>

<style>
* {
  border: solid 0.2px #e0e0e0;
}
</style>
