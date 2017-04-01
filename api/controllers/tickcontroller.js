const mongoose = require('mongoose');
const Tick = mongoose.model('Tick');

exports.get_last_tick = (req, res) => {
    Tick.findOne({'currencyPair': req.params.currencypair}).sort({timestamp: 'desc'}).limit(1).exec((err, tick) => {
        if(err) res.send(err);
        else res.json(tick);
    });
};
