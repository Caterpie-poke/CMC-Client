<template>
<div id="start" transition="expand">
  <div class="kakomi-box11">
    <h1><span class="title-box11">Welcome</span></h1>
    <div id="description">
      <p>説明文</p>
      <p>ボタン2つ（Google, MetaMask）</p>
      <p>ボタンの下にログイン状況（Googleは判定可能、MetaMaskは拡張機能の有無しかわからない）</p>
      <p>Etherがない方は<a target="_blank" href="https://faucet.metamask.io/">こちら</a>からFaucetを取得できます</p>
    </div>
  </div>
  <ul id="buttons">
    <li class="login-form"><GoogleButton/></li>
    <li class="login-form"><MetaMaskButton/></li>
  </ul>
</div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import * as lib from '../myLib'
import GoogleButton from './GoogleButton.vue'
import MetaMaskButton from './MetaMaskButton.vue'


export default {
  name: 'StartPage',
  components: {
    GoogleButton,
    MetaMaskButton,
  },
  computed: {
    ...mapState([
      "isSignedInGoogle",
      "isSignedInMetaMask",
    ]),
  },
  methods: {
    ...mapMutations([
    ]),
    ...mapActions([
    ])
  },
}

</script>

<style scoped>
#start {
  background-color: orange;
  text-align: center;
  height: 100%;
  padding-top: 50px;
}

#buttons {
  display: table;
  table-layout:fixed;
  width: 100%;
  padding: 0px;
}

.login-form {
  display: table-cell;
  vertical-align: middle;
}
.login-form p {
  font-size: 20px;
  padding-top: 20px;
}
#title {
  margin: auto 30px;
  padding-top: 60px;
}
#description {
  text-align: left;
  margin: 30px;
}
#description p:before {
  content: "・";
}

.kakomi-box11 {
 position: relative;
 margin: 2em auto;
 padding: 1em;
 color: #555555; /* 文章色 */
 /* background-color: #fff; 背景色 */
 border: 1px solid #555555; /* 枠線の太さ・色 */
 width: 90%;
}
.title-box11 {
 position: absolute;
 padding: 0 .5em;
 left: 20px;
 top: -15px;
 font-weight: bold;
 background-color: orange;
 color: #555555; /* タイトル文字色 */
}
</style>
