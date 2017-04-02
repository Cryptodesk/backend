// This script adds hardcoded data to the database just for testing
const mongoose = require('mongoose');
require('./models/user');
const User = mongoose.model('User');
const dotenv = require('dotenv');
dotenv.config();
const Poloniex = require('poloniex-api-node');

// connecting to mongo
mongoose.promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

User.remove({}, (err) => {
    if(err) console.log(err);
    console.log('Cleaned previous users.')
});

let user = new User({
    poloniex_key: process.env.POLONIEX_KEY,
    poloniex_secret: process.env.POLONIEX_SECRET,
    balances: [],
    movements: []
});
user.save((err, user) => {
    if(err) console.log(err);
    else console.log('Created user');
});

User.update({_id: user._id}, {$inc: {nonce: 1}}, (err, raw) => {
    console.log('Updated nonce');
});

let poloniex = new Poloniex(user.poloniex_key, user.poloniex_secret);
poloniex.returnBalances((err, balances) => {
    let new_balances = [];
    for(let balance in balances){
        if (balances.hasOwnProperty(balance)) {
            if(balances[balance] > 0) new_balances.push({currency: balance, amount: balances[balance]});
        }
    }
    User.update({_id: user._id},
                {$set: {balances: new_balances}}, (err, raw) => {
                    if(err) console.log(err);
                    else {
                        console.log('Added balances');
                        mongoose.disconnect();
                    }
                });
});
