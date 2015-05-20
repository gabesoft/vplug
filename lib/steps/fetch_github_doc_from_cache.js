'use strict';

var cache = require('../cache')
  , chalk = require('chalk');

module.exports = function (state, _, cb) {
    if (!state.githubDocUrl) { return cb(new Error('No doc url found')); }

    var url = state.githubDocUrl;

    cache.get('doc', url, function (err,  doc) {
        if (doc) {
            state.githubDoc = doc;
        }
        cb();
    });
};
