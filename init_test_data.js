// This script adds hardcoded data to the database just for testing
const mongoose = require('mongoose');
require('./models/user');
const User = mongoose.model('User');

// connecting to mongo
mongoose.promise = global.Promise;
mongoose.connect('mongodb://localhost/cryptodesk');

User.remove({}, (err) => {
    if(err) console.log(err);
    console.log('Cleaned previous users.')
});

let user = new User({
    poloniex_key: 'askdjbasjkdsad',
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
