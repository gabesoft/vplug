'use strict';

var cache = require('../cache')
  , chalk = require('chalk');

function userToString (user) {
    if (!user) {
        return chalk.red('[null]');
    } else {
        return chalk.blue(user.login) + ' (' + chalk.magenta(user.name) + ')';
    }
}

module.exports = function (state, _, cb) {
    var url = state.item.owner.url;

    cache.get('user', url, function (err, user) {
        if (user) {
            state.githubUser = user;
            state.log.info(cache.hitString('user') + ' ' + userToString(state.githubUser));
        }
        cb();
    });
};
