const axios = require("axios");
const config = require("../config/config");

// Apply fabric token
async function applyFabricToken() {
  try {
    const response = await axios.post(
      `${config.baseUrl}/payment/v1/token`,
      {
        appSecret: config.appSecret,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-APP-Key": config.fabricAppId,
        },
      }
    );

    // Assuming your response is a JSON object, no need to parse it
    return response.data;
  } catch (error) {
    console.error("Error while applying fabric token:", error.message);
    throw error; // Propagate the error for handling at a higher level
  }
}

module.exports = applyFabricToken;

// const https = require("http");
// const config = require("../config/config");
// var request = require("request");

// // Apply fabric token
// function applyFabricToken() {
//   return new Promise((resolve, reject) => {
//     var options = {
//       method: "POST",
//       url: config.baseUrl + "/payment/v1/token",
//       headers: {
//         "Content-Type": "application/json",
//         "X-APP-Key": config.fabricAppId,
//       },
//       rejectUnauthorized: false, //add when working with https sites
//       requestCert: false, //add when working with https sites
//       agent: false, //add when working with https sites
//       body: JSON.stringify({
//         appSecret: config.appSecret,
//       }),
//     };
//     console.log(options);
//     request(options, function (error, response) {
//       // if (error) throw new Error(error);
//       // console.log("***********");
//       console.log("BODY", response.body);
//       // console.log(typeof response.body);
//       let result = JSON.parse(response.body);
//       // console.log(result);
//       // console.log("*****************");
//       resolve(result);
//     });
//   });
// }

// module.exports = applyFabricToken;
