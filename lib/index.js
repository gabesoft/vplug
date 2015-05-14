var Runner = require('srunner').Runner
  , path   = require('path')
  , runner = new Runner()
  , store  = require('../conf/store');

var opts = {
        page    : 1
      , created : {}
      // , stars   : { start : 40, end : 99 }
      , stars   : { end : 100 }
    };

runner
   .init({
        dir   : path.join(__dirname, 'steps')
      , state : {
            originalOptions : opts
          , conf            : store.get.bind(store)
          , root            : path.join(__dirname, '..')
        }
    })
   .buildRequestOptions()
   .buildDestination()
   .runSearch()
   .processResults()
   .repeatUntilDone()
   .run();
