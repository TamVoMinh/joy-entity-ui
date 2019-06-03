const Koa = require('koa');
const cors = require('@koa/cors');
const routers = require('./routers');
const responseHandler = require('./responseHandler');
const nestedQuery = require('./nestedQuery');

const entities = require('../data/schema');
const config = require('./config');
const db = require('../data/db')(config.db, entities, console);

const app = new  Koa();
app.use(db.middleware);
app.use(responseHandler());
app.use(nestedQuery());
app.use(
    cors({
      origin: '*',
      allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTION']
    })
  );

app.use(routers.middleware());

if (!module.parent) {
    app.listen(3001,'0.0.0.0', () =>{
        console.log('listen on port 3001 host 0.0.0.0');
    });
}
  
  // Expose app
  module.exports = app;
  