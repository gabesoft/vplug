'use strict';

var Runner     = require('srunner').Runner
  , util       = require('util')
  , path       = require('path')
  , runner     = new Runner()
  , itemRunner = new Runner()
  , store      = require('../conf/store');

module.exports = function (opts, cb) {
    var steps  = path.join(__dirname,  'steps')
      , state  = {
            root : path.join(__dirname, '..', '..')
          , conf : store.get.bind(store)
        };

    itemRunner = itemRunner
       .init({ dir : steps, state : util._extend({}, state) })
       .readDataFile()
       .fetchGithubUser()
       .uploadDataItem();

    runner
       .init({ dir : steps, state : util._extend({}, state) })
       .findDataFiles()
       .forEachFileDo(itemRunner)
       .run(cb);
};
