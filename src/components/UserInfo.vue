<template>
<div id="user-info" class="col-4">
  <div class="card">
    <div class="card-body">
      <h5 class="card-title"><p><strong>User Data (on chain)</strong></p></h5>
      <div class="box27">
          <span class="box-title">Name</span>
          <input v-if="isEditMode" class="card-text" v-model="tempName">
          <p v-else>{{ gettedName }}</p>
      </div>
      <div class="box27">
          <span class="box-title">Gmail</span>
          <input v-if="isEditMode" class="card-text" v-model="tempGmail">
          <p v-else>{{ gettedGmail }}</p>
      </div>
      <div class="btn-toolbar" role="toolbar">
        <button v-bind:class="'btn btn-'+(isEditMode?'secondary':'outline-primary')" v-on:click="toggleEdit">{{ isEditMode?'Cancel':'Edit' }}</button>
        <button v-if="isEditMode" class="btn btn-outline-primary" v-on:click="saveChange(tempName,tempGmail)">Save</button>
      </div>
    </div>
  </div>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title"><p><strong>User Data (used login)</strong></p></h5>
      <div class="box27">
          <span class="box-title">Gmail</span>
          <p>{{ user.gmail }}</p>
      </div>
      <div class="box27">
          <span class="box-title">Ethereum Address</span>
          <p>{{ user.address }}</p>
      </div>
    </div>
  </div>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title"><p><strong>CMC Coin</strong></p></h5>
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text">{{ user.balance }}</span>
        </div>
        <input type="number" class="form-control" v-model="mintAmount">
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" type="button" v-on:click="mint(mintAmount)">Mint</button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import * as lib from '../myLib'

export default {
  name: 'UserInfo',
  components: {
  },
  computed: {
    ...mapState([
      "user",
      "const",
    ]),
  },
  methods: {
    ...mapMutations([
      "assign",
      "loading",
    ]),
    ...mapActions([
      "getMyData",
    ]),
    mint,
    toggleEdit() {
      this.tempName = this.gettedName;
      this.tempGmail = this.gettedGmail;
      this.isEditMode = !this.isEditMode;
    },
    saveChange,
  },
  data() {
    return {
      mintAmount: 0,
      isEditMode: false,
      tempName: '',
      tempGmail: '',
      gettedName: '',
      gettedGmail: '',
    }
  },
  updated() {
    this.gettedName = this.user.name;
    this.gettedGmail = this.user.gmail;
  },
}

async function mint(amount) {
  try {
    this.loading(true)
    await lib.send([{
      from: this.user.address,
      to: this.const.contractAddr,
      data: `0x${lib.getSel('mint')}${lib.num2hex(amount)}`
    }])
    await this.getMyData();
    this.loading(false)
  } catch(err) {
    this.loading(false);
    console.log(err);
  }
}

async function saveChange(n,g) {
  if(n==this.user.name && g==this.user.gmail){
    console.log('No change');
  } else {
    try {
      this.loading(true);
      await lib.send([{
        from: this.user.address,
        to: this.const.contractAddr,
        data: `0x${lib.getSel('setUserData')}${lib.str2bytesArray(2,n)}${lib.str2bytesArray(2,g)}`
      }]);
      this.getMyData();
      this.loading(false)
    } catch (err) {
      this.loading(false);
      console.log(err);
    }
  }
  this.isEditMode = false;
}

</script>

<style scoped>
#user-info {
  height: 100%;
  overflow: scroll;
}

.card {
  margin: 20px auto;
  text-align: left;
}

.card .box27 input {
	font: 15px/24px sans-serif;
	box-sizing: border-box;
	width: 100%;
  height: 22px;
	padding: 0.3em;
	transition: 0.3s;
	letter-spacing: 1px;
	color: #303030;
	border: none;
	border-bottom: 2px solid #1b2538;
	background: transparent;
}

.card.dd {
  width: 200px;
  height: 100px;
  margin: 30px auto;
  /* text-align: center; */
  padding-top: 30px;
}

.card-text {
  word-wrap: normal;
  overflow: scroll;
}

.btn-toolbar .btn {
  margin: auto;
}

.input-group-text {
  width: 100%;
}

.box27 {
    position: relative;
    margin: 2em 0;
    padding: 0.5em 1em;
    border: solid 3px #62c1ce;
}
.box27 .box-title {
    position: absolute;
    display: inline-block;
    top: -27px;
    left: -3px;
    padding: 0 9px;
    height: 25px;
    line-height: 25px;
    font-size: 17px;
    background: #62c1ce;
    color: #ffffff;
    font-weight: bold;
    border-radius: 5px 5px 0 0;
}
.box27 p {
    margin: 0;
    padding: 0;
    word-wrap: normal;
    overflow-y: scroll;
}

.box27 p::-webkit-scrollbar {
  display: none;
}

</style>
