'use strict';

var async = require('async')
  , chalk = require('chalk');

module.exports = function (state, runner, cb) {
    async.each(state.files, function (file, next) {
        state.log.info('processing file ' + chalk.green(file));
        runner._state.filePath = file;
        runner.run(cb);
    }, cb);
};
