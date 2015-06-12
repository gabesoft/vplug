'use strict';

module.exports = function (state, _, cb) {
    if (!state.githubHtmlUrl) { return cb(new Error('No html url found')); }

    state.cache.get('doc', state.githubHtmlUrl, function (err,  doc) {
        if (doc) {
            state.githubDoc = doc;
            state.githubDocCached = true;
        }
        cb();
    });
};
