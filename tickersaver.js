const autobahn = require('autobahn');
const Tick = require('./models/tick');

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
        console.log('Websocket connection started');
    };

    poloniexconnection.onclose = () => {
        console.log('Websocket connection closed');
        console.log('Trying to reopen the connection');
        poloniexconnection.open();
    };

    poloniexconnection.open();
}
