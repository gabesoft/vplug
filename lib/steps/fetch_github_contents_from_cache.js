'use strict';

var cache = require('../cache')
  , chalk = require('chalk');

module.exports = function (state, _, cb) {
    if (!state.githubHtmlUrl) { return cb(new Error('No html url found')); }

    cache.get('contents', state.githubHtmlUrl, function (err,  contents) {
        if (contents) {
            state.githubContents = contents;
        }
        cb();
    });
};
