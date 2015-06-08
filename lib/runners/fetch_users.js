'use strict';

var Runner = require('srunner').Runner
  , util   = require('util')
  , path   = require('path')
  , runner = new Runner()
  , store  = require('../../conf/store');

module.exports = function (cb) {
    var steps  = path.join(__dirname, '..', 'steps')
      , state  = {
            root : path.join(__dirname, '..', '..')
          , conf : store.get.bind(store)
        };

    function mkItemRunner (itemState) {
        return new Runner()
           .init({
                dir         : steps
              , quiet       : true
              , logRunnerId : true
              , state       : util._extend(itemState || {}, state)
            })
           .setGithubRequestHeaders()
           .fetchGithubUserFromCache()
           .fetchGithubUser()
           .cacheGithubUser();
    }

    runner
       .init({ dir : steps, state : util._extend({}, state) })
       .findDataFiles()
       .readItems()
       .forEachItemDo(mkItemRunner)
       .run(cb);
};
