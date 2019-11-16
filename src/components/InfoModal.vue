<template>
<div class="modal fade-scale" id="infoModal" tabindex="-1" role="dialog" aria-labelledby="infoModalTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="infoModalTitle">Token Information</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body card">
        <div class="card-body">
          <div class="kakomi-box11">
            <span class="title-box11">Title</span>
            {{ viewToken.title }}
          </div>
          <div class="kakomi-box11">
            <span class="title-box11">Creater</span>
            {{ viewToken.creater }}
          </div>
          <div class="kakomi-box11">
            <span class="title-box11">Token ID</span>
            {{ viewToken.id }}
          </div>
          <div v-if="viewToken.origin!=''" class="kakomi-box11">
            <span class="title-box11">Origin</span>
            {{ viewToken.origin }}
          </div>
          <div v-if="viewToken.subFile!=''" class="kakomi-box11">
            <span class="title-box11">Sample File</span>
            {{ viewToken.subFile }}
          </div>
          <div class="kakomi-box11">
            <span class="title-box11">Description</span>
            {{ viewToken.desc }}
          </div>
          <!-- <h5 class="card-title">{{ viewToken.title }}</h5> -->
          <!-- <h6 class="card-title">{{ viewToken.creater }}</h6> -->
          <!-- <h6 class="card-subtitle mb-2 text-muted">{{ viewToken.id }}</h6> -->
          <!-- <p class="card-text">{{ viewToken.desc }}</p> -->
          <!-- <a href="#" class="card-link">{{ viewToken.origin==`0x${"0".repeat(64)}`?'':viewToken.origin }}</a> -->
          <!-- <a href="#" class="card-link">{{ viewToken.subFile }}</a> -->
        </div>
      </div>
      <div class="modal-footer">
          <!-- <button id="favo-btn" type="button" class="btn btn-outline-warning rounded-circle" v-bind:disabled="favos.includes(viewToken.id)" v-on:click="favor2"> -->
            <!-- {{ favos.includes(viewToken.id)?'Registerd':'Add to Favorite' }} -->

        <svg id="favo-btn" class="svg-icon btn btn-outline-warning rounded-circle" v-bind:disabled="favos.includes(viewToken.id)" v-on:click="favor2" viewBox="0 0 20 20">
          <path fill="none" d="M16.85,7.275l-3.967-0.577l-1.773-3.593c-0.208-0.423-0.639-0.69-1.11-0.69s-0.902,0.267-1.11,0.69L7.116,6.699L3.148,7.275c-0.466,0.068-0.854,0.394-1,0.842c-0.145,0.448-0.023,0.941,0.314,1.27l2.871,2.799l-0.677,3.951c-0.08,0.464,0.112,0.934,0.493,1.211c0.217,0.156,0.472,0.236,0.728,0.236c0.197,0,0.396-0.048,0.577-0.143l3.547-1.864l3.548,1.864c0.18,0.095,0.381,0.143,0.576,0.143c0.256,0,0.512-0.08,0.729-0.236c0.381-0.277,0.572-0.747,0.492-1.211l-0.678-3.951l2.871-2.799c0.338-0.329,0.459-0.821,0.314-1.27C17.705,7.669,17.316,7.343,16.85,7.275z M13.336,11.754l0.787,4.591l-4.124-2.167l-4.124,2.167l0.788-4.591L3.326,8.5l4.612-0.67l2.062-4.177l2.062,4.177l4.613,0.67L13.336,11.754z"></path>
        </svg>
        <div class="input-group">
          <!-- </button> -->
          <input type="number" class="form-control" v-bind:min="viewToken.price" v-bind:placeholder="viewToken.price" v-model="payAmount" required>
          <div class="input-group-append">
            <button class="btn btn-outline-primary" type="button" v-on:click="purchase">Purchase</button>
          </div>
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
  name: 'InfoModal',
  components: {
  },
  computed: {
    ...mapState([
      "viewToken",
      "user",
      "const",
      "favos",
    ]),
  },
  methods: {
    ...mapMutations([
      "loading",
      "tableReset",
      "setFavo",
    ]),
    ...mapActions([
      "loadPurchases",
      "loadFavorites2",
      "loadRecent",
    ]),
    favor,
    favor2,
    purchase,
  },
  updated() {
  },
  data() {
    return {
      payAmount: 0,
    }
  },
}

async function purchase() {
  try {
    this.loading(true);
    await lib.send([{
      from: this.user.address,
      to: this.const.contractAddr,
      data: `0x${lib.getSel('buy')}${this.viewToken.id}${lib.num2hex(this.payAmount)}`
    }]);
    this.loading(false);
    await this.loadPurchases();
    await this.loadRecent();
    this.tableReset();
  } catch(err) {
    this.loading(false);
    console.log(err);
  }
}


async function favor() {
  try {
    this.loading(true);
    await lib.send([{
      from: this.user.address,
      to: this.const.contractAddr,
      data: `0x${lib.getSel('favo')}${this.viewToken.id}`
    }]);
    this.loading(false);
    await this.loadFavorites();
    await this.loadRecent();
    this.tableReset();
  } catch(err) {
    this.loading(false);
    console.log(err);
  }
}

async function favor2() {
  try {
    this.setFavo(this.viewToken.id);
    await this.loadFavorites2();
    await this.loadRecent();
    this.tableReset();
  } catch (err) {
    console.log(err);
  }
}



</script>

<style scoped>
.modal-footer {
  justify-content: center;
}

#favo-btn {
  margin-right: 20px;
}

.modal-body {
  /* word-wrap: break-word; */
  /* text-align: left; */
  padding: 0px;
}

.card-body {
  text-align: center;
}

.kakomi-box11 {
 position: relative;
 margin: 2em auto;
 padding: 1em;
 color: #555555; /* 文章色 */
 background-color: #fff; /* 背景色 */
 border: 1px solid #555555; /* 枠線の太さ・色 */
 width: 90%;
}
.title-box11 {
 position: absolute;
 padding: 0 .5em;
 left: 20px;
 top: -15px;
 font-weight: bold;
 background-color: #fff; /* タイトル背景色 */
 color: #555555; /* タイトル文字色 */
}

.input-group {
  width: 50%;
  margin: auto 12px;
}

.svg-icon {
  width: 3em;
  height: 3em;
}

.svg-icon path,
.svg-icon polygon,
.svg-icon rect {
  fill: orange;
}

.svg-icon circle {
  stroke: orange;
  stroke-width: 1;
}

</style>
