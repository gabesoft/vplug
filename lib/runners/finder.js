'use strict';

var Runner = require('srunner').Runner
  , path   = require('path')
  , runner = new Runner()
  , store  = require('../../conf/store');

module.exports = function (opts, cb) {
    opts.page = 1;

    var init = {
            dir   : path.join(__dirname, '..', 'steps')
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

    // TODO: use https://gregexithub.com/harthur/brain
    //       - use htmlUrl for all cache items
    //       to figure out the likelyhood of a repo being a vim plugin
    //       input a bit array with the following values
    //       [ lib, colors, spec, autoload, ftdetect, ftplugin, plugin, doc, indent, syntax, test, t, snippets, percentage of vim dirs / all dirs, has .el files, has no folders, has .vimrc ]
    //       train it with plugins frow $VIMRUNTIME
    //
    //       need a list of known plugins
    //       need a list of known not plugins
};
