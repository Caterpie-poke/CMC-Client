<template>
<div id="tokens" class="col-8">
  <ul class="nav nav-tabs nav-fill">
    <li class="nav-item">
      <a v-bind:class="[{active : mode=='recent'} ,'nav-link']" v-on:click="change('recent')">Recent</a>
    </li>
    <li class="nav-item">
      <a v-bind:class="[{active : mode=='publications'} ,'nav-link']" v-on:click="change('publications')">Publications</a>
    </li>
    <li class="nav-item">
      <a v-bind:class="[{active : mode=='purchases'} ,'nav-link']" v-on:click="change('purchases')">Purchases</a>
    </li>
    <li class="nav-item">
      <a v-bind:class="[{active : mode=='favorites'} ,'nav-link']" v-on:click="change('favorites')">Favorites</a>
    </li>
  </ul>
  <Table v-bind:mode="mode"/>
</div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import * as lib from '../myLib'
import Table from './Table.vue'


export default {
  name: 'TokenTables',
  components: {
    Table,
  },
  computed: {
    ...mapState([
      "user",
      "const",
      "mode",
    ]),
  },
  methods: {
    ...mapMutations([
      "assign",
      "loading",
    ]),
    ...mapActions([
    ]),
    change,
  },
  data() {
    return {
    }
  },
  async mounted() {
  }
}



function change(key) {
  console.log(key);
  this.assign({k: 'mode', v: key});
}

</script>

<style>
#tokens {
  height: 100%;
  overflow: scroll;
  text-align: center;
}
.nav-tabs {
  margin-top: 12px;
}
.list-group-item {
  text-align: center;
}

</style>
