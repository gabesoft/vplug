'use strict';

var chalk  = require('chalk')
  , moment = require('moment');

function RateLimit (options) {
    options = options || {};
    this.remaining = 0;
    this.limit     = 0;
    this.reset     = 0;
    this.timeout   = 0;
    this.log       = options.log;
}

RateLimit.prototype.parse = function (headers) {
    this.remaining     = +headers['x-ratelimit-remaining'];
    this.reset         = headers['x-ratelimit-reset'] * 1000;
    this.timeout       = (this.reset - Date.now()) + 100;
    this.timeoutString = moment.duration(this.timeout);
    this.now           = moment();
};

RateLimit.prototype.exceeded = function () {
    return this.remaining === 0;
};

RateLimit.prototype.waitForTimeout = function (cb) {
    if (this.remaining > 0) {
        cb();
    } else {
        this.warn('waiting for timeout... ' +
            chalk.yellow(this.timeoutString.humanize()) + ' from' +
            this.now.format('hh:mm:ss'));
        setTimeout(cb, this.timeout);
    }
};

RateLimit.prototype.warn = function (msg) {
    if (this.log) {
        this.log.warn(msg);
    }
};

module.exports.RateLimit = RateLimit;
