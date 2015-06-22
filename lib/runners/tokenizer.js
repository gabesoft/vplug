'use strict';

var Runner = require('srunner').Runner
  , util   = require('util')
  , path   = require('path')
  , runner = new Runner({ name : 'tokenizer' })
  , store  = require('../../config/store');

module.exports = function (cb) {
    var steps  = path.join(__dirname, '..', 'steps')
      , state  = {
            root : path.join(__dirname, '..', '..')
          , conf : store.get.bind(store)
        };

    runner
       .init({ dir : steps, state : state })
       .readData()
       .extractKeywords()
       .formatKeywords()
       .deleteKeywords()
       .uploadKeywords()
       .run(cb);
};
