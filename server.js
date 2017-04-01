const express = require('express');
const mongoose = require('mongoose');
require('./models/tick');
require('./models/user');
const routes = require('./api/routes');
const tickersaver = require('./tickersaver');
const bodyParser = require('body-parser');

// connecting to mongo
mongoose.promise = global.Promise;
mongoose.connect('mongodb://localhost/cryptodesk');

// starting api
let app = express();
let port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.listen(port);
routes(app);

// starting to save ticks
tickersaver.start();

console.log('RESTful API server started on: ' + port);
