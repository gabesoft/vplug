'use strict';

var Request = require('../core/github_request').GithubRequest
  , chalk   = require('chalk');

module.exports = function (state, _, cb) {
    if (state.githubReadme) { return cb(); }

    var request = new Request({
            url     : state.githubReadmeUrl
          , headers : state.githubRequestHeaders
        }, state.log);

    request.get(function (err, body) {
        if (err) {
            state.log.error(err.stack || err.message);
            cb(err);
        } else {
            state.githubReadme = body;
            state.log.info('fetching readme ' + chalk.green(state.githubReadmeUrl));
            cb();
        }
    });
};
