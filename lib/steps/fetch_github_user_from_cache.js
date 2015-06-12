'use strict';

var chalk = require('chalk');

module.exports = function (state, _, cb) {
    if (!state.item) { return cb(new Error('No item found')); }

    state.cache.get('user', state.item.owner.url, function (err, user) {
        if (user) {
            state.githubUser = user;
            state.githubUserCached = true;
        }
        cb();
    });
};
