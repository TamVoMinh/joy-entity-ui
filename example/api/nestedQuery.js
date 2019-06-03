'use strict';
const qs = require('qs');
const merge = require('merge-descriptors');

/**
 * Return middleware that handle exceptions in Koa.
 * Dispose to the first middleware.
 *
 * @return {function} Koa middleware.
 */

const boolRegx = /(true|false)/i;
const intRegx = /^[-]?\d+$/;
const floatRegx = /^[-]?\d+(\.\d+)$/;

const parseAndmergeQuery = request => {
  return merge(request, {

    /**
     * Get parsed query-string.
     *
     * @return {Object}
     * @api public
     */

    get query() {
      let str = this.querystring;
      if (!str) { return {}; }

      this._querycache = this._querycache || {};
      let query = this._querycache[str];
      if (!query) {
        query = qs.parse(
          str,
          {
            allowDots: true,
            decoder: x => {
              if(boolRegx.test(x)) { return Boolean.parse(x); }
              if(floatRegx.test(x)) { return parseFloat(x); }
              if(intRegx.test(x)) { return parseInt(x); }
              return decodeURIComponent(x);
            }
          }
        );
        this._querycache[str];
      }
      return query;
    },

    /**
     * Set query-string as an object.
     *
     * @param {Object} obj
     * @api public
     */

    set query(obj) {
      this.querystring = qs.stringify(obj, { allowDots: true });
    },
  });
};

function nestedQuery() {
  return async (ctx, next) => {
    await parseAndmergeQuery(ctx.request);
    await next();
  };
}

module.exports = nestedQuery;
