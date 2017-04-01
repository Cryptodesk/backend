const usercontroller = require('../controllers/usercontroller');

module.exports = function(app){

    app.route('/user')
            .get(usercontroller.get_static_user);

    app.route('/user/:userId/movement')
            .get(usercontroller.list_user_movements);

    app.route('/user/:userId/movement/create')
            .post(usercontroller.create_movement);

    app.route('/user/:userId/balance')
            .get(usercontroller.list_user_balance);

    app.route('/user/:userId/balance/add')
            .post(usercontroller.add_balance);

    app.route('/user/:userId/balance/remove')
            .post(usercontroller.remove_balance);
};
