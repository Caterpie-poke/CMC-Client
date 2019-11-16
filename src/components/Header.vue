<template>
<nav class="navbar navbar-light bg-light">
  <a class="navbar-brand">
    <img src="../assets/logo.png" width="30" height="30" class="d-inline-block align-top" alt="">
    ComicMarketChain
  </a>
</nav>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import * as lib from '../myLib'


export default {
  name: 'Header',
  components: {
  },
  computed: {
    ...mapState([
    ]),
  },
  methods: {
    ...mapMutations([
      "tableReset",
      "loading",
    ]),
    ...mapActions([
      "initialLoad",
    ]),
  },
  data() {
    return {
    }
  },
  async created() {
    this.loading(true);
    await this.initialLoad();
    await this.tableReset();
    this.loading(false);
  },
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.navbar {
  height: 56px;
}
</style>
