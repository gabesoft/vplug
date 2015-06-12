'use strict';

var chalk = require('chalk');

module.exports = function (state, option, cb) {
    if (!state.responseInfo) { return cb(new Error('No responseInfo object found')); }

    var info    = state.responseInfo
      , limit   = state.rateLimit
      , proceed = function () {
            state.originalOptions.page = info.next || 1;
            state.log.info('starting page ' + chalk.blue(info.next || 1));
            state.runner.run(cb);
        };

    if (info.next && info.next === info.last) {
        cb();
    } else {
        limit.waitForTimeout(proceed);
    }
};
