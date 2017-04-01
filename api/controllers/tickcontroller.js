const mongoose = require('mongoose');
const Tick = mongoose.model('Tick');

exports.list_all_ticks = (req, res) => {
    Tick.find({}, (err, ticks) => {
        if(err) res.send(err);
        else res.json(ticks);
    });
};
