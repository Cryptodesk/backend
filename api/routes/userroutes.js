const usercontroller = require('../controllers/usercontroller');

module.exports = function(app){
    app.route('/user')
            .get(usercontroller.list_users);

    app.route('/user/create')
            .post(usercontroller.create_user);
};
