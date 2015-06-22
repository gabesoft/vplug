'use strict';

var redis = require('redis')
  , conf  = require('../../config/store');

module.exports.client = function (opts) {
    var port   = conf.get('redis:port')
      , host   = conf.get('redis:host');

    return redis.createClient(port, host, opts || {});
};
