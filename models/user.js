const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let UserSchema = new Schema({
    balances: [{currency: String, amount: Number}],
    movements: [{from: String, to: String, amount_from: Number, amount_to: Number, timestamp: {type: Date, default: Date.now}}],
    poloniex_key: String,
    poloniex_secret: String
});

module.exports = mongoose.model('User', UserSchema);
