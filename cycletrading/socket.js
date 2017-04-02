const cycletrading = require('./cycletrading');

module.exports = function(io){
    let user_id;

    io.on('connection', (socket) => {
        socket.on('register', (data) => {
            user_id = data.user_id;
            console.log(user_id+' has connected.');
        });

        socket.on('start', (data) => {
            console.log(user_id+ ' has started the cycle trading algorithm.')
            cycletrading.start(socket, user_id, 'BTC', '0.005');
        });

        socket.on('disconnect', (data) => {
            console.log(user_id+' has disconnected.')
        });
    });
};
