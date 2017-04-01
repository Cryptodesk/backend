const autobahn = require('autobahn');
const mongoose = require('mongoose');
const Tick = mongoose.model('Tick');
const gdax = require('gdax');

let poloniexconnection = new autobahn.Connection({
    url: 'wss://api.poloniex.com',
    realm: "realm1"
});

exports.start = () => {
    poloniexconnection.onopen = (session) => {
        function tickerEvent (args, kwargs) {
            const tick = new Tick({
                currencyPair: args[0],
                last: args[1],
                lowestAsk: args[2],
                highestBid: args[3],
                baseVolume: args[5],
                quoteVolume: args[6],
                platform: 'poloniex'
            });
            tick.save((err, tick) => {
                if(err) console.log('Error saving tick from poloniex');
            });
        }
        session.subscribe('ticker', tickerEvent);
        console.log('Poloniex websocket connection started');
    };
    poloniexconnection.onclose = () => {
        console.log('Poloniex websocket connection closed');
        console.log('Trying to reopen the poloniex connection');
        poloniexconnection.open();
    };
    poloniexconnection.open();

    let gdaxconnection = new gdax.WebsocketClient(['BTC-EUR']);
    gdaxconnection.on('open', (data) => {
        console.log('Gdax websocket connection started');
    });
    gdaxconnection.on('message', (data) => {
        if(data.type === 'match'){
            const tick = new Tick({
                currencyPair: data.product_id.replace('-', '_'),
                last: data.price,
                platform: 'gdax'
            });
            tick.save((err, tick) => {
                if(err) console.log('Error saving tick from gdax');
            });
        }
    });
    gdaxconnection.on('close', (data) => {
        console.log('Gdax websocket connection closed');
    });
}
