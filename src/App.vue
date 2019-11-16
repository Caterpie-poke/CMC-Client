<template>
<div id="app">
  <!-- <EthTest/> -->
  <transition name="fade" mode="out-in">
    <StartPage v-if="!(isSignedInGoogle && isSignedInMetaMask)"/>
    <div v-else id="main">
      <Header/>
      <div class="container-fluid">
        <div class="row">
          <UserInfo/>
          <TokenTables/>
        </div>
      </div>
      <InfoModal ref="imodal"/>
      <PublishModal ref="pmodal"/>
      <!-- <button class="btn btn-success rounded-circle create-btn" data-toggle="modal" data-target="#publishModal" v-on:click="initModal"> -->

<svg class="svg-icon btn btn-outline-primary rounded-circle create-btn" data-toggle="modal" data-target="#publishModal" v-on:click="initModal" viewBox="0 0 20 20">
  <path fill="none" d="M8.416,3.943l1.12-1.12v9.031c0,0.257,0.208,0.464,0.464,0.464c0.256,0,0.464-0.207,0.464-0.464V2.823l1.12,1.12c0.182,0.182,0.476,0.182,0.656,0c0.182-0.181,0.182-0.475,0-0.656l-1.744-1.745c-0.018-0.081-0.048-0.16-0.112-0.224C10.279,1.214,10.137,1.177,10,1.194c-0.137-0.017-0.279,0.02-0.384,0.125C9.551,1.384,9.518,1.465,9.499,1.548L7.76,3.288c-0.182,0.181-0.182,0.475,0,0.656C7.941,4.125,8.234,4.125,8.416,3.943z M15.569,6.286h-2.32v0.928h2.32c0.512,0,0.928,0.416,0.928,0.928v8.817c0,0.513-0.416,0.929-0.928,0.929H4.432c-0.513,0-0.928-0.416-0.928-0.929V8.142c0-0.513,0.416-0.928,0.928-0.928h2.32V6.286h-2.32c-1.025,0-1.856,0.831-1.856,1.856v8.817c0,1.025,0.832,1.856,1.856,1.856h11.138c1.024,0,1.855-0.831,1.855-1.856V8.142C17.425,7.117,16.594,6.286,15.569,6.286z"></path>
</svg>

      <!-- </button> -->
      <!-- <button class="btn btn-danger rounded-circle lft-btm">
        <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>
        <span v-else role="status">&cir;</span>
      </button> -->
      <!-- <div v-if="isLoading||true" class="spinner-grow text-primary top-right" style="width: 3rem; height: 3rem;" role="status">
        <span class="sr-only">Loading</span>
      </div> -->
      <div id="black-filter" v-if="isLoading"><Spiner/></div>
    </div>
  </transition>
</div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import * as lib from './myLib'
import EthTest from './components/EthTest.vue'
import StartPage from './components/StartPage.vue'
import Header from './components/Header.vue'
import PublishModal from './components/PublishModal.vue'
import InfoModal from './components/InfoModal.vue'
import TokenTables from './components/TokenTables.vue'
import UserInfo from './components/UserInfo.vue'
import Spiner from './components/Spiner.vue'


export default {
  name: 'app',
  components: {
    // EthTest,
    StartPage,
    Header,
    PublishModal,
    InfoModal,
    TokenTables,
    UserInfo,
    Spiner,
  },
  computed: {
    ...mapState([
      "isSignedInGoogle",
      "isSignedInMetaMask",
      "isLoading",
    ]),
  },
  methods: {
    ...mapMutations([
    ]),
    ...mapActions([
    ]),
    hello,
    initModal,
  },
  data() {
    return {
    }
  },
  created() {
  }
}

function hello() {
  console.log('Hello!');
  alert('Hello');
}

function initModal() {
  this.$refs.pmodal.initData();
}




</script>

<style>
* {
  /* border: solid 0.2px #e0e0e0; */
  font-family: Quicksand, 游ゴシック体, "Yu Gothic", YuGothic, "ヒラギノ角ゴシック Pro", "Hiragino Kaku Gothic Pro", メイリオ, Meiryo, Osaka, "ＭＳ Ｐゴシック", "MS PGothic", sans-serif;
}

html, body {
  height: 100%;
  min-width: 800px;
  overscroll-behavior: none;
}

.svg-icon {
  width: 3em;
  height: 3em;
}

.svg-icon path,
.svg-icon polygon,
.svg-icon rect {
  fill: #4691f6;
}

.svg-icon circle {
  stroke: #4691f6;
  stroke-width: 1;
}

#black-filter {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  background: #000;
  z-index: 1;
  opacity: 0.5;
}
.my-spiner {
  position:fixed;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  z-index: 02;
}

#app {
  min-width: 800px;
  height: 100%;
  text-align: center;
}
#main {
  height: 100%;
  position: relative;
}

.container-fluid {
  height: calc(100% - 58px);
  padding: 0px;
  margin: 0px;
}
.row {
  height: 100%;
}
.create-btn {
  position: absolute;
  bottom: 16px;
  right: 16px;
}
.top-right {
  position: absolute;
  top: 8px;
  right: 20px;
}

.fade-enter-active, .fade-leave-active {
  will-change: opacity;
  transition: opacity 500ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
}
.fade-enter, .fade-leave-to {
  opacity: 0
}
</style>
