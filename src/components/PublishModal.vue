<template>
<div class="modal fade" id="publishModal" tabindex="-1" role="dialog" aria-labelledby="publishModalTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="publishModalTitle">Publish New Token</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div ref="holder" class="card dd">
          <label class="alt-input" v-if="!file" for="fileInput">
            ファイルを選択、またはドラッグアンドドロップ
            <input id="fileInput" type="file" v-on:change="fileSelect">
          </label>
          <span v-else>{{ file?file.name:'' }}</span>
        </div>
        <!-- <div v-else class="card dd">{{ file?file.name:'' }}</div> -->
        <div class="container">
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">Title</span>
            </div>
            <input type="text" class="form-control" v-model="inStr.title">
          </div>
          <div class="input-group">
            <span class="input-group-text">Price</span>
            <input type="number" class="form-control" v-model="inStr.price">
          </div>
          <div class="input-group">
            <span class="input-group-text">Genre</span>
            <select class="form-control" v-model="inStr.genre">
              <option>Book</option>
              <option>Art</option>
              <option>Audio</option>
              <option>Game</option>
            </select>
          </div>
          <div class="input-group">
            <span class="input-group-text">Origin <font style="color: red;">{{ count.origin }}</font></span>
            <input type="text" class="form-control" v-model="inStr.origin" v-on:input="check('origin')">
          </div>
          <div class="input-group">
            <span class="input-group-text">Description</span>
            <textarea class="form-control" rows="3" v-model="inStr.desc"/>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" v-on:click="publishData">Publish</button>
        <button type="button" class="btn btn-info" v-on:click="upload">Test</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import * as lib from '../myLib'

export default {
  name: 'PublishModal',
  components: {
  },
  computed: {
    ...mapState([
      "user",
      "const",
      "userGdf",
    ]),
  },
  methods: {
    ...mapMutations([
      "assign",
      "loading",
      "tableReset",
    ]),
    ...mapActions([
      "loadPublications",
      "loadRecent",
    ]),
    publishData,
    initData,
    test,
    getMetaDate,
    checkGet,
    checkPost,
    upload,
    fileSelect,
    check,
  },
  data () {
    return {
      inStr: {
        title: '',
        price: 0,
        genre: '',
        desc: '',
        origin: '',
      },
      file: null,
      count: {
        title: 0,
        price: 0,
        genre: 0,
        desc: 0,
        origin: 0,
      }
    }
  },
  mounted(){
    /** hoverエリアにドラッグされた | hoverエリアから外れた | ドラッグが終了した */
    this.$refs.holder.ondragover = () => {
      return false;
    };
    this.$refs.holder.ondragleave = () => {
      return false;
    };
    this.$refs.holder.ondragend = () => {
      return false;
    };
    /** hoverエリアにドロップされた */
    this.$refs.holder.ondrop = (e) => {
      e.preventDefault(); // イベントの伝搬を止めて、アプリケーションのHTMLとファイルが差し替わらないようにする
      this.file = e.dataTransfer.files[0];
      if(this.file){
        console.log(this.file);
      } else {
        alert('Please Drop PDF File');
      }
      return false;
    };
  },
}

function fileSelect(e) {
  e.preventDefault();
  this.file = e.target.files[0];
}

function check(key) {
  this.count[key] = (this.inStr[key]).length;
}

async function publishData() {
  var fileID = null;
  var origin = lib.isBytes32(this.inStr.origin)?this.inStr.origin:("0".repeat(64));
  try {
    this.loading(true);
    var res = await this.userGdf.writeFile(`CMC/${this.file.name}`, this.file.type, this.file);
    fileID = res.id;
    res = await lib.send([{
      from: this.user.address,
      to: this.const.contractAddr,
      data: `0x${lib.getSel('publish')}${lib.num2hex(this.inStr.price)}${lib.genre2hex(this.inStr.genre)}${origin}${lib.str2bytesArray(2, fileID)}${lib.str2bytesArray(2, this.inStr.title)}${lib.str2bytesArray(15, this.inStr.desc)}`
    }])
    this.loading(false);
    await this.loadPublications();
    await this.loadRecent();
    this.tableReset();
  } catch(err) {
    if(!fileID){
      await this.userGdf.unlink(`CMC/${this.file.name}`);
    }
    this.loading(false);
    console.log(err);
  }
}


function initData() {
  this.inStr.title = ''
  this.inStr.price = 0
  this.inStr.genre = ''
  this.inStr.desc = ''
  this.file = null
  this.noFile = true
}


function test() {
  this.userGdf.readdir(this.userGdf.cwd()).then(data=>{
    console.log(data);
  })
}

function getMetaDate(path) {
  this.userGdf.stat(path).then(data=>{
    console.log(data);
  })
}

function checkGet() {
  this.userGdf.requestWithAuth("GET", "https://www.googleapis.com/drive/v3/about", {fields: 'user'}).then(data=>{
    console.log(data);
  })
}

function checkPost() {
  var fileId = '1XoGtZzaYgZJ26sv8-iF3sRWOHVKLq9Kw'
  var bodyData = {
    "role": "reader",
    "type": "user",
    "emailAddress": "yosuke0923@gmail.com"
  }
  this.userGdf.requestWithAuth(
    "POST",
    `https://www.googleapis.com/drive/v3/files/${fileId}/permissions`,
    {},
    {"Content-Type": "application/json"},
    JSON.stringify(bodyData)
  ).then(data=>{
    console.log(data);
  })
}


function upload() {
  this.userGdf.writeFile(`/${this.file.name}`, this.file.type, this.file).then(data=>{
    console.log(data);
    console.log(data.id);
  }).catch(err=>{
    console.log(err);
  })
}

/*
0x1ab95ca8
0000000000000000000000000000000000000000000000000000000000000064
0000000000000000000000000000000000000000000000000000000000000000
0000000000000000000000000000000000000000000000000000000000000031
316b694a74784470325a664c4c5f5265365644663965526f495f55695869694d
0000000000000000000000000000000000000000000000000000000000000000
000000000000000000000000000000000000000000466972737420546f756368
*/






</script>

<style scoped>
.modal-footer {
  justify-content: center;
}

.container {
  padding: auto;
}
.container .input-group {
  margin: 16px auto;
}
.input-group-text {
  width: 120px;
}


.card.dd {
  margin: 18px auto;
  width: 80%;
  height: 60px;
  text-align: center;
}
.card.dd span {
  line-height: 3em;
}
label>input {
  display: none;
}
.alt-input {
  width: 100%;
  height: 100%;
  line-height: 3em;
}

</style>
