import * as middlewares from './middlewares/index';
module.exports = {
    config : require('./config/config'),
    services : require('./services/index'),
    routes : require('./routes/index'),
    middlewares
}