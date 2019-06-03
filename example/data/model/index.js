const { Joi } = require('koa-joi-router');
const param = require('./query.param');
const {
  NanoId,
  ResponseModel,
  UpdateConditions,
  BaseEntity
} = require('./base.model');

const HolidayModel = Joi.object({
  id: NanoId,
  name: Joi.string(),
  salary: Joi.number(),
  joinDate: Joi.date(),
  leaveDate: Joi.date()
    .optional()
    .allow(null),
  payroll: Joi.number()
});

const RequireModel = HolidayModel.requiredKeys('name', 'salary', 'joinDate', 'payroll').optionalKeys('leaveDate');

const OptionalModel = HolidayModel.optionalKeys('name', 'salary', 'joinDate', 'leaveDate', 'payroll');

const InputModel = RequireModel;

const OutputObject = InputModel
  .concat(BaseEntity)
  .options({
    stripUnknown: true
  });

const OutputObjects = param.PaggingResultModel.concat(
  Joi.object({
    rows: Joi.array().items(OutputObject.optional())
  })
);

const OutputModel = ResponseModel.concat(
  Joi.object({
    data: OutputObject
  })
);

const OutputModels = ResponseModel.concat(
  Joi.object({
    data: OutputObjects
  })
);

const UpdateModel = Joi.object({  
  fields: OptionalModel.required(),
  conditions: UpdateConditions.required()
}).options({
  stripUnknown: true
});

const QueryModel = param.baseParam.concat(Joi.object({
  name: param.string,
  salary: param.number,
  joinDate: param.date,
  leaveDate: param.date,
  payroll: param.date
}));

module.exports = {
  InputModel,
  OutputModel,
  OutputModels,
  UpdateModel,
  QueryModel
};