'use strict';

var chalk = require('chalk');

module.exports = function (state, option, cb) {
    if (!state.responseInfo) { return cb(new Error('No responseInfo object found')); }

    var info    = state.responseInfo
      , proceed = function () {
            state.originalOptions.page = info.next || 1;
            state.log.info('starting page ' + chalk.blue(info.next || 1));
            state.runner.run(cb);
        };

    if (info.remaining === 0) {
        state.log.warn('waiting for timeout ...');
        setTimeout(proceed, info.timeout + 100);
    } else if (info.next) {
        proceed();
    } else {
        cb();
    }
};
