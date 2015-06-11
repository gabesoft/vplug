'use strict';

var chalk = require('chalk')
  , async = require('async');

module.exports = function (state, options, cb) {
    state.items = [];
    state.cache.values('repo', function (err, items) {
        items.forEach(function (item) {
            state.items.push(item);
        });

        state.log.info('item count ' + chalk.blue(state.items.length));
        cb();
    });
};
