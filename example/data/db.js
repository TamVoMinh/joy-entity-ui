const Sequelize = require('sequelize');
const debug = require('debug')('ORM');
const faker = require('faker');
const Op = Sequelize.Op;
const operatorsAliases = {
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt,
  $is: Op.is,
  $like: Op.like,
  $contains: Op.like,
  $and: Op.and,
  $or: Op.or
};

class Db {
  constructor(orm, logger) {
    this.sequelize = orm;
    this.Sequelize = Sequelize;
    this.$logger = logger;
  }

  LoadModels(entities) {
    const { sequelize } = this;
    const models = Object.entries(entities).reduce(
      (mbuilder, [modelName, func]) => {
        mbuilder[modelName] = func(sequelize);
        return mbuilder;
      },
      {}
    );
    Object.entries(models).forEach(([modealName, model]) => {
      debug(modealName);
      if (model.associate) {
        model.associate(models);
      }
    });

    debug('models', models);
    Object.assign(this, models);
    return this;
  }

  async initDb() {
    const { sequelize, $logger } = this;
    const syncDb = await sequelize.sync({ force: true });

    const employeelist = [];
    for(let i =0; i < 1000; i++){
      employeelist.push({
        name: faker.name.findName(),
        salary: faker.random.number(100000),
        joinDate: faker.date.past(),
        leaveDate: null,
        payroll: faker.random.number()
      })
    };

    const results = await this.Employee.bulkCreate(employeelist);
    
    $logger.info(
      {
        event: 'execute'
      },
      'database schemas have been setup successfully.'
    );
    return {
      msg: 'DONT USE THIS FOR PRODUCTION! database schemas have been setup successfully.',
      details: { syncDb, results }
    };
  }

  establish() {
    const { sequelize, $logger } = this;
    sequelize
      .authenticate()
      .then(() => {
        $logger.info(
          {
            event: 'execute'
          },
          'Connection has been established successfully.'
        );
      })
      .catch(err => {
        $logger.error(
          {
            err,
            event: 'error'
          },
          'Unable to connect to the database:'
        );
      });
    return this;
  }
}

const createDb = (cfg, entities, logger) => {
  const orm = new Sequelize(cfg.database, null, null, {...cfg, operatorsAliases});

  return new Db(orm, logger)
    .LoadModels(entities)
    .establish();
};

module.exports = (config, entities, logger) => {
  const db = createDb(config, entities, logger);
  return {
    db,
    middleware: (ctx, next) => {
      if(ctx.db) { return next(); }
      ctx.db = db;
      return next();
    }
  };
};
