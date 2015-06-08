'use strict';

var cache = require('../cache')
  , chalk = require('chalk');

module.exports = function (state, _, cb) {
    var url  = state.githubReadmeUrl
      , data = state.githubReadme;
    cache.set('readme', url, data, cb);
};
