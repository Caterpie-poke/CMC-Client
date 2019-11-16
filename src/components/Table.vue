<template>
<ul>
  <li v-for="(token, index) of tokenList" v-bind:key="index">
    <div class="card" data-toggle="modal" data-target="#infoModal" v-on:click="select(token)">
      <div class="card-body">
        <h5 class="card-title">{{ token.title }}</h5>
        <h6 class="card-subtitle mb-2 text-muted">{{ token.genre }}</h6>
        <p class="card-text desc">{{ token.desc }}</p>
      </div>
    </div>
  </li>
</ul>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import * as lib from '../myLib'

export default {
  name: 'Table',
  components: {
  },
  computed: {
    ...mapState([
      "mode",
      "tokens",
    ]),
  },
  methods: {
    ...mapMutations([
      "assign",
      "loading",
    ]),
    ...mapActions([
    ]),
    select,
  },
  data() {
    return {
      tokenList: [],
    }
  },
  watch: {
    mode: function(after, before) {
      console.log('@@changed');
      console.log(`${before}->${after}`);
      if(after != before) this.tokenList = this.tokens[after];
    }
  }
}


function select(token) {
  console.log(`Hello, This is ${token}`);
  this.assign({k: 'viewToken', v: token});
}




</script>

<style scoped>
#tokens {
  height: 100%;
  overflow: scroll;
  text-align: center;
}
.nav-tabs {
  margin-top: 12px;
}
ul {
  list-style: none;
  width: 100%;
  padding: 0px;
}
li {
  float:left;
  margin: 0px;
  /* margin-right:20px; */
  /* margin-bottom:20px; */
  width: 50%;
  height: 180px;
  padding: 12px;
}
.card {
  text-align: left;
  margin: auto;
  width: 100%;
  height: 100%;
}
.card-body {
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.card-text {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
</style>
