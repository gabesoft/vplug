'use strict';

module.exports = function (state, _, cb) {
    state.cache.set('user', state.item.owner.url, state.githubUser, true, cb);
};
