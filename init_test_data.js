// This script adds hardcoded data to the database just for testing
const mongoose = require('mongoose');
require('./models/user');
const User = mongoose.model('User');
cosnt dotenv = require('dotenv');
dotenv.config();

// connecting to mongo
mongoose.promise = global.Promise;
mongoose.connect('mongodb://localhost/cryptodesk');

User.remove({}, (err) => {
    if(err) console.log(err);
    console.log('Cleaned previous users.')
});

let user = new User({
    poloniex_key: process.env.POLONIEX_KEY,
    poloniex_secret: process.env.POLONIEX_SECRET,
    balances: [
        {'currency': 'ETH', 'amount': 8.64841},
        {'currency': 'BTC', 'amount': 0.54896}
    ],
    movements: []
});
user.save((err, user) => {
    if(err) console.log(err);
    else console.log('Created user');
});

mongoose.disconnect();
