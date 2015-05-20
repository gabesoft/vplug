'use strict';

var cache = require('../cache')
  , chalk = require('chalk');

module.exports = function (state, _, cb) {
    var url = state.githubDocUrl
      , doc = state.githubDoc || { message : 'Doc file not found' , url : url };
    cache.set('doc', url, doc, cb);
};
