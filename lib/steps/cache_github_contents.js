'use strict';

var cache = require('../cache')
  , chalk = require('chalk');

module.exports = function (state, _, cb) {
    var url      = state.githubHtmlUrl
      , contents = state.githubContents || { message : 'Contents not found' , url : url };
    cache.set('contents', url, contents, cb);
};
