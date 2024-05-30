const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const WebSocket = require("ws");

const { signString } = require("./utils/tools");
const authToken = require("./service/authTokenService");
const createOrder = require("./service/createOrderService");
const createMandetOrder = require("./service/createMandetOrderService");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Allow cross-origin
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization,X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PATCH, PUT, DELETE"
  );
  res.header("Allow", "GET, POST, PATCH, OPTIONS, PUT, DELETE");
  next();
});

// WebSocket connection handling
wss.on("connection", (ws) => {
  console.log("WebSocket connection established");

  ws.on("message", (message) => {
    console.log("Received message: %s", message);
    // You can add your WebSocket message handling logic here
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });
});

// Your existing routes
app.post("/apply/h5token", function (req, res) {
  authToken.authToken(req, res);
});

// app.post("/create/order", async (req, res) => {
//   try {
//     const resultRaq = await createOrder.createOrder(req, res);
//     return res.send(resultRaq).status(200);
//   } catch (error) {
//     console.error("Error creating order:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// });

app.post("/create/order", async (req, res) => {
  try {
    const resultRaq = await createOrder.createOrder(req, res);

    // Broadcast the result to all connected WebSocket clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        const socketResponse = {
          type: "orderResult",
          data: resultRaq,
        };
        client.send(JSON.stringify(socketResponse));
      }
    });

    // Send the JSON response to the original HTTP request
    res
      .json({
        type: "orderResult",
        data: resultRaq,
      })
      .status(200);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// app.post("/create/order", async function (req, res) {
//   try {
//     const resultRaq = await createOrder.createOrder(req, res);

//     // Broadcast the result to all connected WebSocket clients
//     wss.clients.forEach((client) => {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(JSON.stringify(resultRaq));
//       }
//     });

//     // Send the JSON response to the original HTTP request
//     return res.send(resultRaq).status(200);
//   } catch (error) {
//     console.error("Error creating order:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.post("/create/order", async function (req, res) {
//   try {
//     const resultRaq = await createOrder.createOrder(req, res);
//     // Broadcast the result to all connected WebSocket clients
//     wss.clients.forEach((client) => {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(JSON.stringify(resultRaq));
//       }
//     });

//     res.json({ title: req.body.amount }).status(200);
//   } catch (error) {
//     console.error("Error creating order:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

app.get("/test", function (req, res) {
  return res.send("this is a test message");
});

app.post("/create/mandetOrder", function (req, res) {
  createMandetOrder.createMandetOrder(req, res);
});

app.post("/api/v1/notify", (req, res) => {
  console.log("Notify Response Hits HERE!");
  // Handle your notification logic here
  res.status(201).json({ body: req.body });
});

app.put("/api/v1/notify", (req, res) => {
  console.log("New Notify Response Body Hit PUT");
  console.log({ REQ_BODY: req.body });
  res.status(201).json({ body: req.body });
});

// Start server
const serverPort = process.env.PORT || 8081;
server.listen(serverPort, () => {
  console.log("Server started, port:" + serverPort);
});
