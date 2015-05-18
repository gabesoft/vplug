'use strict';

var async = require('async')
  , chalk = require('chalk');

module.exports = function (state, mkRunner, cb) {
    async.eachSeries(state.items, function (item, next) {
        mkRunner({ item : item }).run(function (err) {
            if (err) { state.log.error(err.message); }
            next(err);
        });
    }, cb);
};
