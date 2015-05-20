'use strict';

var RateLimit = require('./rate_limit').RateLimit
  , util      = require('util')
  , request   = require('request');

function GithubRequest (options, log) {
    this.options = options;
    this.log     = log;
}

GithubRequest.prototype.get = function (cb) {
    var opts = util._extend({ method : 'GET', json : true }, this.options)
      , log  = this.log;

    (function fetch () {
        request(opts, function (err, response, body) {
            if (err) { return cb(err); }

            var limit = new RateLimit({ log : log });

            limit.parse(response.headers);

            if (limit.exceeded()) {
                limit.waitForTimeout(fetch);
            } else {
                cb(null, body);
            }
        });
    })();
};

module.exports.GithubRequest = GithubRequest;
