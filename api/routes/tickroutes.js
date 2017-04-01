const tickcontroller = require('../controllers/tickcontroller');

module.exports = function(app){

    app.route('/tick/:currencypair')
        .get(tickcontroller.get_last_tick);
};
