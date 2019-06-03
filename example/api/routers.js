const router = require('koa-joi-router');
const controler = require('./controler');

const routers =  router();
routers.prefix('/entities');
Object.values(controler).map(handler => {
    routers.route(handler);
});

module.exports = routers;