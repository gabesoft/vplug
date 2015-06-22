'use strict';

var Runner = require('srunner').Runner
  , runner = new Runner({ name : 'uploader' })
  , util   = require('util')
  , path   = require('path')
  , path   = require('path')
  , Cache  = require('../redis_cache').Cache
  , redis  = require('../core/redis_helper')
  , store  = require('../../config/store');

module.exports = function (cb) {
    cb = cb || function () {};

    var steps  = path.join(__dirname, '..', 'steps')
      , client = redis.client()
      , cache  = new Cache(client)
      , state  = {
            root  : path.join(__dirname, '..', '..')
          , conf  : store.get.bind(store)
          , cache : cache
          , known : require(path.join(__dirname, '../data/known.json'))
        };

    function mkItemRunner (itemState) {
        return new Runner()
           .init({
                dir         : steps
              , quiet       : true
              , logRunnerId : true
              , state       : util._extend(itemState || {}, state)
            })
           .setGithubReadmeUrl()
           .setGithubDocUrl()
           .setGithubHtmlUrl()
           .fetchGithubUserFromCache()
           .fetchGithubReadmeFromCache()
           .fetchGithubDocFromCache()
           .fetchGithubContentsFromCache()
           .initializeNet()
           .uploadDataItem();
    }

    runner
       .init({ dir : steps, state : util._extend({}, state) })
       .readItems()
       .forEachItemDo(mkItemRunner)
       .run(function (err) {
            client.quit();
            cb(err);
        });
};
