'use strict';

var async = require('async')
  , util  = require('util')
  , chalk = require('chalk');

module.exports = function (state, _, cb) {
    if (!state.responseBody) {
        state.log.warn('No response body found');
        return cb();
    }

    if (!util.isArray(state.responseBody.items)) {
        state.log.warn('No results found');
        return cb();
    }

    var items = state.responseBody.items;

    state.log.info('saving ' + chalk.blue(items.length) + ' results');

    async.each(items, function (r, next) {
        state.cache.set('repo', r.html_url, r, true, next);
    }, cb);
};
