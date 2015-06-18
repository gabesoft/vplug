'use strict';

var Runner = require('srunner').Runner
  , runner = new Runner({ name : 'finder' })
  , path   = require('path')
  , Cache  = require('../redis_cache').Cache
  , redis  = require('../core/redis_helper')
  , store  = require('../../conf/store');

module.exports = function (opts, cb) {
    cb = cb || function () {};
    opts.page = 1;

    var client = redis.client()
      , cache  = new Cache(client)
      , init   = {
            dir   : path.join(__dirname, '..', 'steps')
          , state : {
                originalOptions : opts
              , conf            : store.get.bind(store)
              , root            : path.join(__dirname,  '..',  '..')
              , cache           : cache
            }
        };

    runner
       .init(init)
       .buildRequestOptions()
       .runSearch()
       .saveSearchResults()
       .processResponseHeaders()
       .repeatUntilDone()
       .run(function (err) {
            client.quit();
            cb(err);
        });
};
