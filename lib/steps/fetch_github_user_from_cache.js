'use strict';

var cache = require('../cache')
  , chalk = require('chalk');

module.exports = function (state, _, cb) {
    if (!state.item) { return cb(new Error('No item found')); }

    var url = state.item.owner.url;

    cache.get('user', url, function (err, user) {
        if (user) {
            state.githubUser = user;
        }
        cb();
    });
};
