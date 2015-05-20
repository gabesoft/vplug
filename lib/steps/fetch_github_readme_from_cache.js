'use strict';

var cache = require('../cache')
  , chalk = require('chalk');

module.exports = function (state, _, cb) {
    if (!state.githubReadmeUrl) { return cb(new Error('No readme url found')); }

    var url = state.githubReadmeUrl;

    cache.get('readme', url, function (err,  data) {
        if (data) {
            state.githubReadme = data;
        }
        cb();
    });
};
