const tickcontroller = require('./controllers/tickcontroller');

module.exports = function(app){
    app.route('/ticks')
        .get(tickcontroller.list_all_ticks);
};
