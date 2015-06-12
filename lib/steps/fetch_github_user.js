'use strict';

var Request = require('../core/github_request').GithubRequest
  , chalk   = require('chalk');

function userToString (user) {
    if (!user) {
        return chalk.red('[null]');
    } else {
        return chalk.blue(user.login) + ' (' + chalk.magenta(user.name) + ')';
    }
}

module.exports = function (state, _, cb) {
    if (state.githubUser) { return cb(); }

    var request = new Request({
            url     : state.item.owner.url
          , headers : state.githubRequestHeaders
        }, state.log);

    request.get(function (err, body) {
        if (err) {
            state.log.error(err.stack || err.message);
            cb(err);
        } else {
            state.githubUser = body;
            state.log.info('fetching user '+ userToString(state.githubUser));
            cb();
        }
    });
};
