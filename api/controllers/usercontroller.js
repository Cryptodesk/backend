const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.get_static_user = (req, res) => {
    User.findOne((err, user) => {
        if(err) res.send(err);
        else res.json(user._id);
    });
};

exports.list_user_balance = (req, res) => {
    User.findById(req.params.userId, (err, user) => {
        if(err) res.send(err);
        else if(!user) res.send(new Error('User with id '+req.params.userId+' does not exists.'))
        else res.json(user.balances);
    });
};

exports.list_user_movements = (req, res) => {
    User.findById(req.params.userId, (err, user) => {
        if(err) res.send(err);
        else if(!user) res.send(new Error('User with id '+req.params.userId+' does not exists.'))
        else res.json(user.movements);
    });
};

exports.add_balance = (req, res) => {
    User.update({_id: req.params.userId},
                {$push: {balances: req.body}}, (err, raw) => {
                    if(err) res.send(err);
                    else res.send(raw);
                });
};

exports.remove_balance = (req, res) => {
    User.update({_id: req.params.userId},
                {$pull: {balances: req.body}}, (err, raw) => {
                    if(err) res.send(err);
                    else res.send(raw);
                });
};

exports.create_movement = (req, res) => {
    // first update updates to + adds the movement and the second one updates from
    console.log(req);
    console.log(req.body);
    User.update({_id: req.params.userId,
                 'balances.currency': req.body.to},
                {$push: {movements: req.body},
                 $inc: {'balances.$.amount': req.body.amount_to}}, (err, raw) => {
                    if(err) res.send(err);
                    else {
                        User.update({_id: req.params.userId,
                                     'balances.currency': req.body.from},
                                    {$inc: {'balances.$.amount': -req.body.amount_from}}, (err, raw) => {
                                        if(err) res.send(err);
                                        else res.send(raw);
                                    });
                    }
                });
};
