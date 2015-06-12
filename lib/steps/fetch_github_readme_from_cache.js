'use strict';

module.exports = function (state, _, cb) {
    if (!state.githubHtmlUrl) { return cb(new Error('No html url specified')); }

    state.cache.get('readme', state.githubHtmlUrl, function (err,  data) {
        if (data) {
            state.githubReadme = data;
            state.githubReadmeCached = true;
        }
        cb();
    });
};
