const debug = require('debug')('employee.controler');
const { INVALID_REQUEST, POST, GET, PUT } = require('./const');
const { NanoId } = require('../data/model/base.model');
const {
  InputModel,
  OutputModel,
  OutputModels,
  UpdateModel,
  QueryModel
} = require('../data/model');

const pagging = {
  maxlimit: 50,
};

exports.InitEmployee = {
  path: '/employee-init',
  method: GET,
  validate: {},
  handler: async ctx => {
    const {
      db,
      res
    } = ctx;

    const result = await db.initDb();
    res.ok({message: result.msg});
  }
};

exports.addEmployee = {
  path: '/employee',
  method: POST,
  validate: {
    type: 'json',
    body: InputModel,
    output: {
      200: {
        body: OutputModel
      }
    },
    continueOnError: false
  },
  handler: async ctx => {
    const {
      db,
      request: {
        body: newEmployee
      },
      invalid,
      res
    } = ctx;

    if (invalid) {
      throw {
        ...INVALID_REQUEST,
        data: invalid.body.details[0]
      };
    }

    const result = await db.Employee.create(newEmployee);
    res.ok({
      data: result.toJSON()
    });
  }
};

exports.updateEmployee = {
  path: '/employee/:id',
  method: PUT,
  validate: {
    type: 'json',
    params: {
      id: NanoId.required()
    },
    body: UpdateModel,
    output: {
      200: {
        body: OutputModel
      }
    },
    continueOnError: false
  },
  handler: async ctx => {
    const {
      db,
      request: {
        body
      },
      invalid,
      res
    } = ctx;
    if (invalid) {
      throw {
        ...INVALID_REQUEST,
        data: invalid
      };
    }

    const { fields, conditions: { id, updatedAt } } = body;
    const [err, effected] = await db.Employee.update(fields, {
      returning: true,
      where: { id, updatedAt }
    });
    if(!err && effected === 1) {
      const checkEntity = await db.Employee.findByPk(id);
      res.ok({ data: checkEntity.toJSON() });
    }else{
      throw {
        statusCode: 409,
        code: 'OUT_OF_DATE',
        details: err
      };
    }
  }
};

exports.getEmployee = {
  path: '/employee/:id',
  method: GET,
  validate: {
    params: {
      id: NanoId.required()
    },
    output: {
      200: {
        body: OutputModel
      }
    },
    continueOnError: false
  },
  handler: async ctx => {
    const {
      db,
      params: { id },
      invalid,
      res
    } = ctx;
    if (invalid) {
      throw {
        ...INVALID_REQUEST,
        details: invalid.params
      };
    }

    const entity = await await db.Employee.findByPk(id);
    if(entity) {
      const data = entity.toJSON();
      debug(data);
      res.ok({ data });
    }else{
      throw {
        statusCode: 404,
        code: 'NOT_FOUND',
      };
    }
  }
};


exports.queryEmployee = {
  path: '/employee',
  method: GET,
  validate: {
    query: QueryModel,
    output: {
      200: {
        body: OutputModels
      }
    },
    continueOnError: true
  },
  handler: async ctx => {
    const {
      db,
      query: { p, sortBy, ...conditions },
      invalid,
      res
    } = ctx;
    if (invalid) {
      throw {
        ...INVALID_REQUEST,
        data: invalid.query.details[0]
      };
    }

    const plimit = parseInt(p.limit);
    const offset = parseInt(p.offset);
    const limit = plimit < pagging.maxlimit ? plimit : pagging.maxlimit;
    
    if(conditions.name && conditions.name.$contains){
      //SqlLite does not support $contains & i'm lazy ^_^.
      conditions.name.$contains = `%${conditions.name.$contains}%`;
    }

    const queryObject = {
      where: conditions,
      offset,
      limit
    };
    if(sortBy && sortBy.length) {
      queryObject.order = [sortBy];
    }

    const queryResult = await db.Employee.findAndCountAll(queryObject);

    const rows = queryResult.rows.map(m => m.toJSON());
    res.ok({ data: {
      rows,
      total: queryResult.count,
      offset,
      limit
    } });
  }
};
