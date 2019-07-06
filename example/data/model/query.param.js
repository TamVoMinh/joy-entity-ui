const { Joi } = require('koa-joi-router');

const $Number = Joi.number().integer()
  .optional()
  .allow(null);

const $Date = Joi.string().regex(/^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z)?)?)?)?$/i)
  .optional()
  .allow(null);

const $String = Joi.string()
  .optional()
  .allow(null);

const $key = Joi.string()
  .regex(/[a-z0-9-]+/i)
  .max(32);

const equal = 'equal';
const not_equal = 'not equal';
const greater_than = 'greater than';
const greater_than_or_equal = 'greater than or equal';
const less_than = 'less than';
const less_than_or_equal = 'less than or equal';
const like = 'like, %key% for contain, key% for startWith';
const contains = 'contains';

exports.keyId = Joi.object({
  $eq: $key.description('nano id Or uuid')
});

exports.number = Joi.object({
  $eq: $Number.description(equal),
  $ne: $Number.description(not_equal),
  $gt: $Number.description(greater_than),
  $gte: $Number.description(greater_than_or_equal),
  $lt: $Number.description(less_than),
  $lte: $Number.description(less_than_or_equal)
});
exports.date = {
  $eq: $Date.description(equal),
  $ne: $Date.description(not_equal),
  $gt: $Date.description(greater_than),
  $gte: $Date.description(greater_than_or_equal),
  $lt: $Date.description(less_than),
  $lte: $Date.description(less_than_or_equal)
};
exports.string = Joi.object({
  $eq: $String.description(equal),
  $ne: $String.description(not_equal),
  $like: $String.description(like),
  $contains: $String.description(contains)
});

exports.baseParam = Joi.object({
  $or: Joi.array()
    .items(Joi.object())
    .optional(),
  $and: Joi.object()
    .optional(),
  p: Joi.object({
    offset: Joi.number().integer()
      .min(0)
      .required(),
    limit: Joi.number().integer()
      .min(0)
      .required()
  }),
  sortBy: Joi
    .array()
    .items(Joi.string().optional())
    .length(2)
});

const limit = Joi.number()
  .integer()
  .min(5)
  .max(100)
  .required();

const offset = Joi.number()
  .integer()
  .min(0)
  .required();

const total = Joi.number()
  .integer()
  .min(0)
  .required();


const pagging = Joi.object({ limit, offset });
exports.$Pagging = pagging;

exports.PaggingResultModel = Joi.object({
  limit,
  offset,
  total
});
