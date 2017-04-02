const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
require('./models/tick');
require('./models/user');
const routes = require('./api/routes');
const tickersaver = require('./tickersaver');
const bodyParser = require('body-parser');
const socket = require('socket.io');
const cycle = require('./cycletrading/socket');
const dotenv = require('dotenv');

dotenv.config();

// connecting to mongo
mongoose.promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

// starting api
let app = express();
let server = http.createServer(app);
let port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});
server.listen(port);
routes(app);

// starting socket.io for cycle trading
let io = socket();

io.listen(server);
cycle(io);

// starting to save ticks
tickersaver.start();

console.log('RESTful API server and socket.io started on: ' + port);
