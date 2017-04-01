const express = require('express');
const mongoose = require('mongoose');
const routes = require('./api/routes');
const tickersaver = require('./tickersaver');

// connecting to mongo
mongoose.promise = global.Promise;
mongoose.connect('mongodb://localhost/cryptodesk');

// starting api
let app = express();
let port = process.env.PORT || 3000;

app.listen(port);
routes(app);

// starting to save ticks
tickersaver.start();

console.log('RESTful API server started on: ' + port);
