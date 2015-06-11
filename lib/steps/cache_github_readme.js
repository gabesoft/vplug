'use strict';

var cache = require('../cache')
  , chalk = require('chalk');

module.exports = function (state, _, cb) {
    if (!state.githubHtmlUrl) { return cb(new Error('No html url specified')); }

    var url  = state.githubHtmlUrl
      , data = state.githubReadme;
    cache.set('readme', url, data, cb);
};
