const crypto = require("crypto");
const config = require("../config/config");
const pmlib = require("./sign-util-lib");

function test2() {
  const sign = crypto.createSign("RSA-SHA256");
  sign.update("hello world");
  sign.end();
  let res = sign.sign(config.privateKey).toString("base64");
  console.log(res);
  return res;
}

// Fields not participating in signature
const excludeFields = [
  "sign",
  "sign_type",
  "header",
  "refund_info",
  "openType",
  "raw_request",
  "biz_content",
];

function signRequestObject(requestObject) {
  let fields = [];
  let fieldMap = {};
  for (let key in requestObject) {
    if (excludeFields.indexOf(key) >= 0) {
      continue;
    }
    fields.push(key);
    fieldMap[key] = requestObject[key];
  }
  // the fields in "biz_content" must Participating signature
  if (requestObject.biz_content) {
    let biz = requestObject.biz_content;
    for (let key in biz) {
      if (excludeFields.indexOf(key) >= 0) {
        continue;
      }
      fields.push(key);
      fieldMap[key] = biz[key];
    }
  }
  // sort by ascii
  fields.sort();

  let signStrList = [];
  for (let i = 0; i < fields.length; i++) {
    let key = fields[i];
    signStrList.push(key + "=" + fieldMap[key]);
  }
  let signOriginStr = signStrList.join("&");
  console.log("signOriginStr", signOriginStr);
  return signString(signOriginStr, config.privateKey);
}

// function signString(str, privateKey) {
//     // return test2();
//     const sign = crypto.createSign('RSA-SHA256');
//     sign.update(str);
//     sign.end();
//     return sign.sign(privateKey).toString("base64");
// }

let signString = (text, privateKey) => {
  const sha256withrsa = new pmlib.rs.KJUR.crypto.Signature({
    alg: "SHA256withRSAandMGF1",
  });
  sha256withrsa.init(privateKey);
  sha256withrsa.updateString(text);
  const sign = pmlib.rs.hextob64(sha256withrsa.sign());
  return sign;
};

function createTimeStamp() {
  return Math.round(new Date() / 1000) + "";
}

// create a 32 length random string
function createNonceStr() {
  let chars = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  let str = "";
  for (let i = 0; i < 32; i++) {
    let index = parseInt(Math.random() * 35);
    str += chars[index];
  }
  return str;
}

module.exports = {
  signString: signString,
  signRequestObject: signRequestObject,
  createTimeStamp: createTimeStamp,
  createNonceStr: createNonceStr,
};
