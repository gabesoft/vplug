'use strict';

var cache = require('../cache')
  , chalk = require('chalk');

module.exports = function (state, _, cb) {
    if (!state.githubHtmlUrl) { return cb(new Error('No html url specified')); }

    cache.get('readme', state.githubHtmlUrl, function (err,  data) {
        if (data) {
            state.githubReadme = data;
        }
        cb();
    });
};
