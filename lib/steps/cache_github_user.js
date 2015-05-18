'use strict';

var cache = require('../cache')
  , chalk = require('chalk');

module.exports = function (state, _, cb) {
    var url  = state.item.owner.url
      , user = state.githubUser;
    cache.set('user', url, user, cb);
};
