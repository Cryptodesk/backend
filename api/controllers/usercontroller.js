const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.create_user = (req, res) => {
    let user = new User(req.body);
    user.save((err, user) => {
        if(err) res.send(err);
        else res.json(user);
    });
};

exports.get_user = (req, res) => {

};

exports.list_users = (req, res) => {
    User.find({}, (err, users) => {
        if(err) res.send(err);
        else res.json(users);
    });
};

exports.add_balance = (req, res) => {

};

exports.create_movement = (req, res) => {

};
