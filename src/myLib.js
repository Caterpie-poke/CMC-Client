
// 1, 'helloEOL' -> ['6767162.....00']
export function str2bytesArray(i, s) {
  var str_hex = "";
  var c_hex = "";
  for (var c of s) {
    c_hex = encodeURI(c).replace(/%/g, '');
    if (c == c_hex) {
      str_hex += ("0" + c.charCodeAt(0).toString(16)).substr(-2)
    } else {
      str_hex += c_hex;
    }
  }
  if(str_hex.length > 64 * i) throw 'String Length Over';
  return zeroPadding(i*64, str_hex);
}

// ['56884..46', .. , '6738..00'] -> 'Hello'
export function bytesArray2str(bArray) {
  const hex = bArray.join('');
  var symbolInserted = "";
  for (var i = 0; i < hex.length; i++) {
    if (i % 2 == 0) symbolInserted += '%';
    symbolInserted += hex.charAt(i);
  }
  const decoded = decodeURI(symbolInserted.replace(/%00/g, ''));
  return decoded.replace(/%[0-9a-fA-F]{2}/g, match => String.fromCharCode(`0x${match.slice(1)}`));
}

// 12 -> '0000..0c'
export function num2hex(decNumber) {
  return zeroPadding(64, parseInt(decNumber).toString(16));
}

// '00..0c' -> 12
export function hex2num(hex) {
  return parseInt('0x'+hex);
}

// true -> '000..01'
export function bool2hex(bool) {
  return `${"0".repeat(63)}${bool ? 1 : 0}`;
}

// '00..01' -> true
export function hex2bool(hex) {
  return parseInt(hex) % 2 == 1;
}

// '0x235..01' (len40+2) -> '000000235..01' (len64)
export function address2hex(addr) {
  return zeroPadding(64, addr.slice(2));
}

// '000235..01' -> '0x235..01'
export function hex2address(hex) {
  return `0x${hex.slice(24)}`;
}

// 'Genre' -> uint8 data
export function genre2hex(genre) {
  const genreId = {
    'Book': 0,
    'Art': 1,
    'Audio': 2,
    'Game': 3
  }
  return num2hex(genreId[genre]);
}

// uint8 data -> 'Genre'
export function hex2genre(hex) {
  const genre = [
    'Book',
    'Art',
    'Audio',
    'Game'
  ];
  return genre[parseInt(hex)];
}

// '1~5' -> uint
// star <--> hex is same to uint

export function bytes2hex(byte) {
  return zeroPadding(64, byte);
}

export function isBytes32(s) {
  return s.length == 64 && s.match(/[0-9a-fA-F]{64}/g);
}

export function zeroPadding(size, hexLiteral) {
  if (size < hexLiteral.length) throw 'Text Size Over';
  const lack = size - hexLiteral.length;
  return `${"0".repeat(lack)}${hexLiteral}`;
}

// export function argParse(args) {
//   var res = {
//     memPos: 0,
//     memory: '',
//     stack: ''
//   }
//   for(var arg of args){
//     if(arg.static) {
//       res.memPos += (arg.hex.length / 64) * 32;
//     } else {
//       res.memPos += 32;
//     }
//   }
//   for(arg of args){
//     if(arg.static){
//       res.memory += arg.hex;
//     } else {
//       res.memory += num2hex(res.memPos);
//       res.memPos += 32 * (arg.hex.length / 64);
//       res.stack += arg.hex;
//     }
//   }
//   const argArray = res.memory.concat(res.stack);
//   return argArray;
// }

// export function resParse(resHex, specs) {
//   var result = [];
//   var memPos = specs.length;
//   const resArray = resHex.slice(2).split(/.{64}/);
//   for(var i = 0; i < specs.length; i++){
//     if(specs[i].static){
//       result.push(specs[i].f(resArray[i]));
//     } else {
//       var len = hex2num(resArray[memPos]);
//       var str = specs[i].f((resArray.slice(memPos, memPos + 1 + (len/64))).join('').slice(0, 2*len));
//       result.push(str);
//       memPos += 1 + (len / 64);
//     }
//   }
//   return result;
// }


export function parseRes(resHex) {
  if (resHex.slice(2).length % 64 != 0 && resHex.slice(10).length % 64 != 0) {
    throw `Invalid resHex: ${resHex}`;
  }
  var hasHead = resHex.slice(2).length % 64 != 0;
  var resArray = [];
  var resHead = hasHead ? resHex.slice(2, 2 + 8) : "";
  var resHexTrim = resHex.slice(hasHead ? 10 : 2);
  if (resHexTrim.length % 64 != 0) throw `Invalid resHex: ${resHexTrim}`;
  for (var i = 0; i < (resHexTrim.length / 64); i++) {
    resArray.push(resHexTrim.slice(64 * i, 64 * (i + 1)));
  }
  return {
    head: resHead,
    body: resArray
  };
}

export function getSel(funcName) {
  const funcs = {
    // cmc.sol
    isExistUserData: "isExistUserData(address)",  // -> bool
    getUserData: "getUserData(address)",  // -> (bytes32[2],bytes32[2])
    getDataforPermit: "getDataforPermit(address,bytes32)",  // -> (bytes32[2],bytes32[2])
    getUserPublications: "getUserPublications(address)",  // -> bytes32[]
    getUserPurchased: "getUserPurchased(address)",  // -> bytes32[]
    isFavorite: "isFavorite(address,bytes32)",  // -> bool
    isPermitted: "isPermitted(address,bytes32)",  // -> bool
    setUserData: "setUserData(bytes32[2],bytes32[2])",
    publish: "publish(uint256,uint8,bytes32,bytes32[2],bytes32[2],bytes32[15])",
    buy: "buy(bytes32,uint256)",
    favo: "favo(bytes32)",
    permit: "permit(address,bytes32)",
    // cmc_token.sol
    getTokenData: "getTokenData(bytes32)",  // -> (address,uint256,uint8,bytes32,bytes32[2],bytes32[2],bytes32[2],bytes32[15])
    getTokenOwners: "getTokenOwners(bytes32)",  // -> address[]
    // cmc_review.sol
    isReviewed: "isReviewed(address)",  // -> bool
    getStar: "getStar(address,address)",  // -> Star
    getComment: "getComment(address,address)",  // -> bytes32[15]
    getReviewRate: "getReviewRate(address)",  // -> uint256[2]
    changeStar: "changeStar(address,uint8)",
    changeComment: "changeComment(address,bytes32,bytes32[15])",
    firstReview: "firstReview(address,uint8,bytes32,bytes32[15])",
    // cmc_coin.sol
    totalSupply: "totalSupply()",  // -> uint256
    balanceOf: "balanceOf(address)",  // -> uint256
    allowance: "allowance(address,address)",  // -> uint256
    mint: "mint(uint256)",
    transfer: "transfer(address,uint256)",
    approve: "approve(address,uint256)",
    transferFrom: "transferFrom(address,address,uint256)",
  };
  const keccak256 = require('keccak256');
  var sel = '';
  if (funcs[funcName] == 'undefined'){
    console.log(`${funcName}: Not exist in Methods`);
  } else {
    sel = keccak256(funcs[funcName]).toString('hex').slice(0,8);
  }
  return sel;
}

export function call(params) {
  console.log('@@call_param');
  console.log(params);
  return new Promise((resolve, reject) => {
    window.ethereum.send('eth_call', params).then(data => {
      var resHex = data.result;
      isError(resHex).then(errLog => {
        reject(errLog);  // -> err message
      }).catch(response => {
        resolve(response.body);  // -> resArray
      })
    }).catch(err => {
      reject(err);  // -> err message
    })
  })
}

export function send(params) {
  console.log('@@send_param');
  console.log(params);
  return new Promise((resolve, reject) => {
    window.ethereum.send('eth_sendTransaction', params).then(data => {
      var txHash = data.result;
      console.log('@@txHash');
      console.log(txHash);
      isError(txHash).then(errLog => {
        console.log('@@errLog');
        console.log(errLog);
        reject(errLog);  // -> err message
      }).catch(response => {
        const txHash = response.body[0];
        console.log('@@pending');
        waitPending(txHash).then(receipt => {
          if(receipt.status == '0x1'){
            resolve(receipt);  // mined, and success, -> receipt JSON DATA
          } else {
            reject(receipt);  // mined, but failed, -> receipt JSON DATA
          }
        }).catch(err => {
          reject(err);  // -> err message
        })
      });
    }).catch(err => {
      console.log('@@send_err');
      console.log(err);
      reject(err);  // -> err message
    });
  })
}

export function isError(resHex) {
  return new Promise((resolve, reject) => {
    if (resHex == "0x") {
      resolve('Error');  // -> err message
    } else {
      var response = parseRes(resHex);
      if (response.head.toLowerCase() == '08c379a0') {
        var errLog = parseErr(response.body);
        resolve(`Error: ${errLog}`);  // -> err message
      } else {
        reject(response);  // -> not err response, {head:~, body:~}
      }
    }
  })
}

function parseErr(resArray) {
  return bytesArray2str(resArray.slice(2));
}

export function waitPending(txHash) {
  console.log('@@in waitPending');
  console.log(txHash);
  return new Promise((resolve, reject) => {
    window.ethereum.send('eth_getTransactionReceipt', [`0x${txHash}`]).then(data => {
      var receipt = data.result;
      if (receipt == null) {
        setTimeout(() => { resolve(waitPending(txHash)) }, 1000);
      } else {
        resolve(receipt);  // -> receipt JSON DATA
      }
    }).catch(err => {
      console.log('@@Invalid param');
      reject(err);  // -> err message
    })
  })
}

export function getBlockNum() {
  return new Promise((resolve, reject) => {
    window.ethereum.send('eth_blockNumber').then(res => {
      resolve(parseInt(res.result));
    }).catch(err => {
      reject(err);
    })
  })
}

/* -> Array of topicArray
0  : event selector
1~ : event call params
*/
export function getEventLog(params) {
  var params_old = [{
    "fromBlock": "0x0",
    "toBlock": "latest",
    "address": 'contract',
    "topics": [
      [],
      [],
      "0x0000000000000000000000000000000000000000000000000000000000000001"
    ],
  }];
  var logs = [];
  return new Promise((resolve, reject)=>{
    window.ethereum.send('eth_getLogs', params).then(res => {
      for (var tx of res.result) {
        logs.push(tx.topics);
      }
      resolve(logs);
    }).catch(err => {
      reject(err);
    })
  })
}


/* (bytes32[2],bytes32[2]) -> (bytes32,bytes32,bytes32,bytes32)
0x76b179c7
000000000000000000000000000000000000000000000000000000000000007b
00000000000000000000000000000000000000000000000000000000000001c8
0000000000000000000000000000000000000000000000000000000000000315
000000000000000000000000000000000000000000000000000000000000014e

0xde347a1b
000000000000000000000000000000000000000000004e65774163636f756e74
0000796f73756b652e776174616e6162652e3039323340676d61696c2e636f6d

0xde347a1b
0000000000000000000000000000000000000000000000000000000000000000
000000000000000000000000000000000000000000004e65774163636f756e74
0000000000000000000000000000000000000000000000000000000000000000
0000796f73756b652e776174616e6162652e3039323340676d61696c2e636f6d
*/
