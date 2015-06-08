'use strict';

var Runner = require('srunner').Runner
  , util   = require('util')
  , path   = require('path')
  , runner = new Runner()
  , store  = require('../../conf/store');

module.exports = function (cb) {
    var steps = path.join(__dirname, '..', 'steps')
      , state = {
            root : path.join(__dirname, '..', '..')
          , conf : store.get.bind(store)
        };

    runner
       .init({ dir : steps, state : util._extend({}, state) })
       .readTrainUrls()
       .readTrainData()
       .train()
       .saveTrainResults()
       .run(cb);
};
