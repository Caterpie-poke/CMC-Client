<template>
<ul id="eth-test" class="list-group list-group-horizontal">
  <li class="list-group-item test-sec">
    <div class="card">
      <h5 class="card-title">aaa</h5>
      <button class="btn btn-primary" v-on:click="hogege()">callEvent</button>
    </div>
  </li>
</ul>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import * as lib from '../myLib'

export default {
  name: 'EthTest',
  components: {
  },
  computed: {
    ...mapState([
    ]),
  },
  methods: {
    ...mapMutations([
    ]),
    ...mapActions([
      "loginMetaMask",
    ]),
    test,
  },
  data() {
    return {
      isPending: false,
      text: '',
    }
  },
  async created() {
    // await this.loginMetaMask();
    // console.log(this.cmc);
  }
}

function test(){
  alert('TEST');
}




</script>

<style scoped>
ul {
  flex-wrap: wrap;
}
.test-sec {
  margin: 20px;
}
.card input {
  font-size: 18px;
}
#eth-test .card {
  width: 200px;
}
.card * {
  margin: auto;
}
</style>
