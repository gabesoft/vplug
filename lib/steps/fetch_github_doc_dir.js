'use strict';

var cache   = require('../cache')
  , Request = require('../core/github_request').GithubRequest
  , chalk   = require('chalk');

module.exports = function (state, _, cb) {
    if (state.githubDoc) { return cb(); }

    var request = new Request({
            url     : state.githubDocUrl
          , headers : state.githubRequestHeaders
        }, state.log);

    request.get(function (err, body) {
        if (err) {
            state.log.error(err.stack || err.message);
            cb(err);
        } else {
            state.githubDocFiles = body;
            cb();
        }
    });
};
