'use strict';

var path  = require('path')
  , chalk = require('chalk')
  , fs    = require('fs');

module.exports = function (state, _, cb) {
    var relpath = 'lib/data/train_results.json';
    state.log.info('saving train results to ' + chalk.green(relpath));
    fs.writeFile(
        path.join(state.root, relpath)
      , JSON.stringify(state.trainResults)
      , cb);
};
