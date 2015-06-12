'use strict';

var Runner = require('srunner').Runner
  , runner = new Runner()
  , util   = require('util')
  , path   = require('path')
  , Cache  = require('../redis_cache').Cache
  , redis  = require('../core/redis_helper')
  , store  = require('../../conf/store');

module.exports = function (cb) {
    cb = cb || function () {};

    var steps = path.join(__dirname, '..', 'steps')
      , client = redis.client()
      , cache  = new Cache(client)
      , state = {
            root  : path.join(__dirname, '..', '..')
          , conf  : store.get.bind(store)
          , cache : cache
        };

    runner
       .init({ dir : steps, state : util._extend({}, state) })
       .readTrainUrls()
       .readTrainData()
       .train()
       .saveTrainResults()
       .run(function (err) {
            client.quit();
            cb(err);
       });
};
