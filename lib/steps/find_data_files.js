'use strict';

var glob  = require('glob')
  , chalk = require('chalk')
  , path  = require('path');

module.exports = function (state, options, cb) {
    if (!state.root) { cb(new Error('No root directory set')); }

    var patt = path.join(state.root, 'data', '**', 'result.*.json');

    glob(patt, function (err, files) {
        if (err) { return cb(err); }

        state.files = files;
        state.log.info('found ' + chalk.blue(files.length) + ' data files');
        cb();
    });
};
