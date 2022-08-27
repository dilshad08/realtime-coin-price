require("dotenv").config();

const PORT = process.env.PORT || 3000
const ORIGIN=process.env.ORIGIN || `http://localhost:${PORT}`

const http = require("http")
const express = require("express")
const socketio = require("socket.io")
const createError = require('http-errors');
const axios = require('axios')

const onlineClients = new Set();
const API_ENDPOINT = process.env.BINANCE_API_ENDPOINT;



const getApiAndEmit = async socket => {
  try {
    const res = await axios.get(API_ENDPOINT);
    socket.emit("FromAPI", res.data);
    // console.log(res.data);

  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
};

let createdInterval;
function onNewWebsocketConnection(socket) {
  console.info(`Socket ${socket.id} has connected.`);
  onlineClients.add(socket.id);
  clearInterval(createdInterval);
  createdInterval = setInterval(
    () => getApiAndEmit(socket),
    5000
  );

  socket.on("disconnect", () => {
      onlineClients.delete(socket.id);
      console.info(`Socket ${socket.id} has disconnected.`);
  });
}

function startServer() {
  const app = express()
  const path = require("path")
  const server = http.createServer(app)
  const io = socketio(server);

  app.use("/api", require('./src/routes'))
  // set up express app properties serve static assets
  app.use(express.static(path.join(__dirname, "public")))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .get("/", (req, res) => res.render("index.ejs"))

  // will fire for every new websocket connection
  io.on("connection", onNewWebsocketConnection);


  server.listen(PORT, () => {
    console.log(`Coin Price App is listening on port ${PORT}!`);
  });

  app.use((req, res, next) => {
    next(createError(404, 'Not found'));
  });

  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
      error: {
        status: err.status || 500,
        message: err.message
      }
    });
  });

}

startServer();
