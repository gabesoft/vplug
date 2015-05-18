'use strict';

var request   = require('request')
  , cache     = require('../cache')
  , RateLimit = require('../core/rate_limit').RateLimit
  , chalk     = require('chalk');

function userToString (user) {
    if (!user) {
        return chalk.red('[null]');
    } else {
        return chalk.blue(user.login) + ' (' + chalk.magenta(user.name) + ')';
    }
}

module.exports = function (state, _, cb) {
    var conf = state.conf
      , url  = state.item.owner.url;

    if (state.githubUser) { return cb(); }

    (function fetch () {
        request({
            url     : url
          , method  : 'GET'
          , json    : true
          , headers : {
                'User-Agent'    : conf('userAgent')
              , 'Authorization' : 'token ' + conf('github:token')
              , 'Accept'        : '*/*'
            }
        }, function (err, response, body) {
            if (err) {
                state.log.error(err.message);
                return cb(err);
            }

            var limit = new RateLimit({ log : state.log });

            limit.parse(response.headers);

            if (limit.exceeded()) {
                limit.waitForTimeout(fetch);
            } else {
                state.githubUser = body;
                state.log.info(cache.missString('user')  + ' ' + userToString(state.githubUser));
                cb();
            }
        });
    })();
};
