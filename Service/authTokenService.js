const applyFabricToken = require("./applyFabricTokenService");
const tools = require("../utils/tools");
const config = require("../config/config");
var request = require("request");
const https = require("http");

exports.authToken = async (req, res) => {
  let appToken = req.body.authToken;
  console.log("token = ", appToken);

  let applyFabricTokenResult = await applyFabricToken();
  let fabricToken = applyFabricTokenResult.token;
  console.log("fabricToken =", fabricToken);

  let result = await exports.requestAuthToken(fabricToken, appToken);
  console.log("***********START RES****************");
  console.log(result);
  console.log("************END RES***************");
  res.send(result);
};

exports.requestAuthToken = async (fabricToken, appToken) => {
  return new Promise((resolve) => {
    let reqObject = createRequestObject(appToken);
    console.log("REQEST_OBJECT", reqObject);
    var options = {
      method: "POST",
      url: config.baseUrl + "/payment/v1/auth/authToken",
      headers: {
        "Content-Type": "application/json",
        "X-APP-Key": config.fabricAppId,
        Authorization: fabricToken,
      },
      rejectUnauthorized: false, //add when working with https sites
      requestCert: false, //add when working with https sites
      agent: false, //add when working with https sites
      body: JSON.stringify(reqObject),
    };
    request(options, function (error, response) {
      let result = JSON.parse(response.body);
      console.log("result*", result);
      resolve(result);
    });
  });
};

function createRequestObject(appToken) {
  let req = {
    timestamp: tools.createTimeStamp(),
    method: "payment.authtoken",
    nonce_str: tools.createNonceStr(),
    version: "1.0",
  };
  let biz = {
    access_token: appToken,
    trade_type: "InApp",
    appid: config.merchantAppId,
    resource_type: "OpenId",
  };
  req.biz_content = biz;
  req.sign = tools.signRequestObject(req);
  req.sign_type = "SHA256WithRSA";
  return req;
}
