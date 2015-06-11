'use strict';

var cache = require('../cache')
  , chalk = require('chalk');

module.exports = function (state, _, cb) {
    if (!state.githubHtmlUrl) { return cb(new Error('No html url specified')); }

    var url      = state.githubHtmlUrl
      , contents = state.githubContents || { message : 'Contents not found' , url : url };
    cache.set('contents', url, contents, cb);
};
