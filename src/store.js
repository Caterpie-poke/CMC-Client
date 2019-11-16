import Vue from 'vue'
import Vuex from 'vuex'
import * as lib from './myLib'

const Gdfs = require("gdrive-fs");


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    const: {
      eventSel: {
        Publish: '248252243fae52606913ae1d9692fda220805f08529d3d7113b5eaec567dc016',
        Purchase: '04c64dac69bd2cf3ab7d441b51a74c4c9db4c23451500d1b0bff3f195334ac79',
        Favorite: '528d01ae859e1c0df20c0152ee7f8e70bb54b167dd30c5fb0d7683a6695e8630',
        Permit: '04659db9a2a2dce78519431d87b65ccbd361d66546162254d709850917cc296b',
        Inherit: '89fb27ef3732f5b45ae4d18a9f22787b7b6c7e5b50eeeacba6703d849619c736',
        Stared: 'e1086ab88f28c019fed6bfdbf051550c1e917498f7b4a130397e2661ffb84726',
        Commented: 'b1a9ce5ca23bc3707cf5cdb6b8bf23ca6018df6024ad726af4fe655036f7e8c9',
        Transfer: 'ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        Approval: '8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'
      },
      contractAddr: '0xf7E68420B498de515168c40Bd14A72a01e5A4E0e',
      clientID: '803887283250-43ght1ut8tbd7kphlbfa958om341afai.apps.googleusercontent.com',
      APIKey: 'AIzaSyAdU5OmqP8gsrSOTR36ooSbkhrbCM0IQ2E',
    },
    user: {
      name: '',
      address: '',
      gmail: '',
      gmailOnChain: '',
      balance: 0,
    },
    isSignedInGoogle: false,
    isSignedInMetaMask: false,
    isLoading: false,
    userGdf: null,
    tokens: {
      publications: [],
      purchases: [],
      favorites: [],
      recent: [],
    },
    mode: '',
    favos: [],
    viewToken: {
      id: '',
      creater: '',
      price: '',
      genre: '',
      origin: '',
      title: '',
      mainFile: '',
      subFile: '',
      desc: '',
      isFavor: '',
    },
  },
  mutations: {
    assign(state, payload) {
      state[payload.k] = payload.v;
    },
    assign2(state, payload) {
      state[payload.k1][payload.k2] = payload.v;
    },
    loading(state, bool) {
      state.isLoading = bool;
    },
    tableReset(state) {
      console.log('@@called resetTable');
      state.mode = 'none';
      state.mode = 'recent';
    },
    setFavo(state, id) {
      state.favos.push(id);
      localStorage.setItem('favoList', JSON.stringify(state.favos));
    },
    getFavo(state) {
      if (localStorage.favoList) {
        state.favos = JSON.parse(localStorage.favoList);
      }
    },
  },
  actions: {
    async loginGoogle({ commit, state }) {
      await Gdfs.loadApi(state.const.clientID, state.const.APIKey);
      if(!Gdfs.isSignedIn()){
        try {
          await Gdfs.signIn();
          commit('assign', {k: 'userGdf', v: new Gdfs()});
          commit('assign', {k: 'isSignedInGoogle', v: true});
        } catch (error) {
          alert('Cannot sign in Google');
        }
      } else {
        commit('assign', {k: 'userGdf', v: new Gdfs()});
        state.userGdf.requestWithAuth(
          "GET",
          "https://www.googleapis.com/drive/v3/about",
          { fields: 'user' }
        ).then(data => {
          commit('assign2', {k1: 'user', k2: 'gmail', v: JSON.parse(data).user.emailAddress});
          commit('assign', {k: 'isSignedInGoogle', v: true});
        }).catch(err => {
          console.log(err);
        });
      }
    },
    async loginMetaMask({ commit }) {
      if(!window.ethereum || !window.ethereum.isMetaMask){
        alert('Please install MetaMask\nhttps://metamask.io/');
      }else {
        try {
          var accounts = await window.ethereum.enable();
          window.ethereum.on('accountsChanged', (tempAccount) => {
            alert('アカウントが切り替わりました。再読み込みします。');
            if (tempAccount[0] != accounts[0]) location.reload();
          });
          commit('assign2', {k1: 'user', k2: 'address', v: accounts[0]});
          commit('assign', {k: 'isSignedInMetaMask', v: true});
        } catch (err) {
          console.log(err);
          alert('Cannot sign in MetaMask');
        }
      }
    },
    async initialLoad({ commit, state, dispatch }) {
      try {
        if (! await state.userGdf.readdir('/CMC') && confirm('Make ./CMC in your GoogleDrive, OK?')) {
          await state.userGdf.mkdir('/CMC/');
        }
        var resArray = await lib.call([{
          from: state.user.address,
          to: state.const.contractAddr,
          data: `0x${lib.getSel('isExistUserData')}${lib.address2hex(state.user.address)}`
        }]);
        if (!lib.hex2bool(resArray[0])) {
          await lib.send([{
            from: state.user.address,
            to: state.const.contractAddr,
            data: `0x${lib.getSel('setUserData')}${lib.str2bytesArray(2, 'Test Account')}${lib.str2bytesArray(2, state.user.gmail)}`
          }]);
          await dispatch('initialLoad');
        } else {
          await dispatch('getMyData');
          await dispatch('tokenLoad');
          await dispatch('notice');
        }
      }catch(err){
        console.log(err);
      }
    },
    async getMyData({ commit, state, dispatch }) {
      try {
        var resArray = await lib.call([{
          from: state.user.address,
          to: state.const.contractAddr,
          data: `0x${lib.getSel('getUserData')}${lib.address2hex(state.user.address)}`
        }]);
        commit('assign2', { k1: 'user', k2: 'name', v: lib.bytesArray2str(resArray.slice(0, 2)) });
        commit('assign2', { k1: 'user', k2: 'gmailOnChain', v: lib.bytesArray2str(resArray.slice(2, 4)) });
        resArray = await lib.call([{
          from: state.user.address,
          to: state.const.contractAddr,
          data: `0x${lib.getSel('balanceOf')}${lib.address2hex(state.user.address)}`
        }]);
        commit('assign2', { k1: 'user', k2: 'balance', v: lib.hex2num(resArray[0]) });
      } catch (err) {
        console.log(err);
      }
    },
    async tokenLoad({ commit, state, dispatch }) {
      try {
        await dispatch('loadPublications');
        await dispatch('loadPurchases');
        await dispatch('loadFavorites2');
        await dispatch('loadRecent');
      } catch (err) {
        console.log(err);
      }
    },
    async loadPurchases({ commit, state, dispatch }) {
      try {
        var resArray = await lib.call([{
          from: state.user.address,
          to: state.const.contractAddr,
          data: `0x${lib.getSel('getUserPurchased')}${lib.address2hex(state.user.address)}`
        }]);
        if (resArray.length > 2) {
          var tokenList = await dispatch('genTokenList', resArray.slice(2));
          commit('assign2', { k1: 'tokens', k2: 'purchases', v: tokenList });
        }
      } catch (err) {
        console.log(err);
      }
    },
    async loadPublications({ commit, state, dispatch }) {
      try {
        var resArray = await lib.call([{
          from: state.user.address,
          to: state.const.contractAddr,
          data: `0x${lib.getSel('getUserPublications')}${lib.address2hex(state.user.address)}`
        }]);
        if (resArray.length > 2) {
          var tokenList = await dispatch('genTokenList', resArray.slice(2));
          commit('assign2', { k1: 'tokens', k2: 'publications', v: tokenList });
        }
      } catch (err) {
        console.log(err);
      }
    },
    async loadFavorites({ commit, state, dispatch }) {
      try {
        var topics = await lib.getEventLog([{
          "fromBlock": "0x0",
          "toBlock": "latest",
          "address": state.const.contractAddr,
          "topics": [
            `0x${state.const.eventSel.Favorite}`,
            `0x${lib.address2hex(state.user.address)}`,
          ],
        }]);
        if (topics.length > 0) {
          var tokenIds = topics.map(topic => lib.address2hex(topic[2]));
          var tokenList = await dispatch('genTokenList', tokenIds);
          commit('assign2', { k1: 'tokens', k2: 'favorites', v: tokenList });
        }
      } catch (err) {
        console.log(err);
      }
    },
    async loadFavorites2({ commit, state, dispatch }) {
      try {
        commit('getFavo');
        if (state.favos.length > 0) {
          var tokenList = await dispatch('genTokenList', state.favos);
          commit('assign2', { k1: 'tokens', k2: 'favorites', v: tokenList });
        }
      } catch (err) {
        console.log(err);
      }
    },
    async loadRecent({ commit, state, dispatch }) {
      try {
        var topics = await lib.getEventLog([{
          "fromBlock": "0x0",
          "toBlock": "latest",
          "address": state.const.contractAddr,
          "topics": [
            `0x${state.const.eventSel.Publish}`,
          ],
        }]);
        if (topics.length > 0) {
          var tokenIds = topics.map(topic => lib.address2hex(topic[2]));
          var tokenList = await dispatch('genTokenList', tokenIds);
          commit('assign2', { k1: 'tokens', k2: 'recent', v: tokenList });
        }
      } catch (err) {
        console.log(err);
      }
    },
    async genTokenList({ commit, state }, tokenIds) {
      var tokenList = [];
      try {
        for(var tokenId of tokenIds){
          var tokenData = await lib.call([{
            from: state.user.address,
            to: state.const.contractAddr,
            data: `0x${lib.getSel('getTokenData')}${lib.bytes2hex(tokenId)}`
          }]);
          // var isFavorite = await lib.call([{
          //   from: state.user.address,
          //   to: state.const.contractAddr,
          //   data: `0x${lib.getSel('isFavorite')}${lib.address2hex(state.user.address)}${lib.bytes2hex(tokenId)}`
          // }]);
          tokenList.push({
            id: tokenId,
            creater: lib.hex2address(tokenData[0]),
            price: lib.hex2num(tokenData[1]),
            genre: lib.hex2genre(tokenData[2]),
            origin: lib.hex2bool(tokenData[3])?`0x${tokenData[3]}`:'',
            title: lib.bytesArray2str(tokenData.slice(4, 6)),
            mainFile: lib.bytesArray2str(tokenData.slice(6, 8)),
            subFile: lib.bytesArray2str(tokenData.slice(8, 10)),
            desc: lib.bytesArray2str(tokenData.slice(8)),
            // isFavor: lib.hex2bool(isFavorite[0]),
          });
        }
        return tokenList.reverse();
      } catch (err) {
        console.log(err);
        throw 'Fail to get Token Data';
      }
    },
    async addPermission({ commit, dispatch, state }, fileId, buyerAddr) {
      try {
        await state.userGdf.requestWithAuth(
          "POST",
          `https://www.googleapis.com/drive/v3/files/${fileId}/permissions`,
          {},
          { "Content-Type": "application/json" },
          JSON.stringify({
            role: "reader",
            type: "user",
            emailAddress: buyerAddr
          })
        );
      } catch(err) {
        console.log(err);
      }
    },
    async notice({ commit, dispatch, state }){
      try {
        var topics = await lib.getEventLog([{
          fromBlock: '0x0',
          toBlock: 'latest',
          address: state.const.contractAddr,
          topics: [
            `0x${state.const.eventSel.Purchase}`,
            [],
            [],
            `0x${lib.address2hex(state.user.address)}`
          ]
        }]);
        if(topics.length > 0){
          var notPermittedList = topics.filter(async topic => {
            var isPermitted = await lib.call([{
              from: state.user.address,
              to: state.const.contractAddr,
              data: `0x${lib.getSel('isPermitted')}${lib.address2hex(topic[1])}${topic[2].slice(2)}`
            }]);
            return !lib.hex2bool(isPermitted[0]);
          });
          for(var notPermit of notPermittedList){
            if(confirm(`${notPermit[2]} の閲覧を許可しますか?`)){
              await lib.send([{
                from: state.user.address,
                to: state.const.contractAddr,
                data: `0x${lib.getSel('permit')}${lib.address2hex(notPermit[1])}${notPermit[2].slice(2)}`
              }]);
              var res = await lib.call([{
                from: state.user.address,
                to: state.const.contractAddr,
                data: `0x${lib.getSel('getDataforPermit')}${lib.address2hex(notPermit[1])}${notPermit[2].slice(2)}`
              }]);
              const gmail = lib.bytesArray2str(res.slice(0, 2));
              const fid = lib.bytesArray2str(res.slice(2, 4));
              if(gmail != state.user.gmail){
                await dispatch('addPermission', fid, gmail);
              } else {
                console.log('同じアドレス（アカウント）なので共有完了');
              }
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
  }
})

