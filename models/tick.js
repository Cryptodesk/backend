const mongoose = require('mongoose');

let Schema = mongoose.Schema;


let TickSchema = new Schema({
    currencyPair: String,
    last: Number,
    lowestAsk: Number,
    highestBid: Number,
    baseVolume: Number,
    quoteVolume: Number,
    timestamp: {
        type: Date,
        default: Date.now
    },
    platform: {
        type: String,
        enum: ['poloniex', 'gdax']
    }
});

module.exports = mongoose.model('Ticks', TickSchema);
