'use strict';

module.exports = function (state, _, cb) {
    if (state.githubUserCached) {
        cb();
    } else {
        state.cache.set('user', state.item.owner.url, state.githubUser, true, cb);
    }
};
