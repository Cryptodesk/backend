const usercontroller = require('../controllers/usercontroller');

module.exports = function(app){

    // just for testing
    app.route('/user')
            .get(usercontroller.get_static_user);

    // chat & desktop endpoints
    app.route('/user/:userId/movement')
            .get(usercontroller.list_user_movements);

    app.route('/user/:userId/balance')
            .get(usercontroller.list_user_balance);

    // manual update methods
    app.route('/user/:userId/movement/create')
            .post(usercontroller.create_movement);

    app.route('/user/:userId/balance/add')
            .post(usercontroller.add_balance);

    app.route('/user/:userId/balance/remove')
            .post(usercontroller.remove_balance);
};
