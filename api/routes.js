const tickroutes = require('./routes/tickroutes');
const userroutes = require('./routes/userroutes');

module.exports = function(app){
    tickroutes(app);
    userroutes(app);
};
