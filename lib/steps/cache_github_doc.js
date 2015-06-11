'use strict';

var cache = require('../cache')
  , chalk = require('chalk');

module.exports = function (state, _, cb) {
    if (!state.githubHtmlUrl) { return cb(new Error('No html url specified')); }

    var url = state.githubHtmlUrl
      , doc = state.githubDoc || { message : 'Doc file not found' , url : url };
    cache.set('doc', url, doc, cb);
};
