'use strict';

var cache = require('../cache')
  , chalk = require('chalk');

module.exports = function (state, _, cb) {
    if (!state.githubHtmlUrl) { return cb(new Error('No html url found')); }

    var url = state.githubDocUrl;

    cache.get('doc', url, function (err,  doc) {
        if (doc) {
            state.githubDoc = doc;
        }
        cb();
    });
};
