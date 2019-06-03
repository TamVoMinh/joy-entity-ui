const { Joi } = require('koa-joi-router');

exports.NanoId = Joi.string().length(9).hex();

exports.ResponseModel = Joi.object({
  status: Joi.string(),
  message: Joi.string()
    .optional()
    .allow('', null)
}).options({ allowUnknown: true });

const UpdateConditions = Joi.object({
  id: Joi.string(),
  updatedAt: Joi.date().required()
});

exports.UpdateConditions = UpdateConditions;
exports.BaseEntity = UpdateConditions.concat(Joi.object({
  createdAt: Joi.date().required()
}));
