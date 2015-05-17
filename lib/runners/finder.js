'use strict';

var Runner = require('srunner').Runner
  , path   = require('path')
  , runner = new Runner()
  , store  = require('../../conf/store');

module.exports = function (opts, cb) {
    opts.page = 1;

    var init = {
            dir   : path.join(__dirname,  'steps')
          , state : {
                originalOptions : opts
              , conf            : store.get.bind(store)
              , root            : path.join(__dirname,  '..',  '..')
            }
        };

    runner
       .init(init)
       .buildRequestOptions()
       .buildDestination()
       .runSearch()
       .processResults()
       .repeatUntilDone()
       .run(cb);
};
