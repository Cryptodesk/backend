const express = require('express');
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
let api_port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});
app.listen(api_port);
routes(app);

// starting socket.io for cycle trading
let io = socket();
let socket_port = process.env.PORT || 4000;

//io.listen(socket_port);
//cycle(io);

// starting to save ticks
tickersaver.start();

console.log('RESTful API server started on: ' + api_port+' and socket.io started on: '+socket_port);
