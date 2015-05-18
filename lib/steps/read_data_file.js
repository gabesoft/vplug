'use strict';

var chalk = require('chalk');

module.exports = function (state, options, cb) {
    state.log.info('reading file ' + chalk.green(state.filePath));
    state.fileData = require(state.filePath);
    cb();
};
