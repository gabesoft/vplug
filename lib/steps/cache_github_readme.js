'use strict';

module.exports = function (state, _, cb) {
    if (state.githubReadmeCached) { return cb(); }
    if (!state.githubHtmlUrl) { return cb(new Error('No html url specified')); }

    var url  = state.githubHtmlUrl
      , data = state.githubReadme;
    state.cache.set('readme', url, data, false, cb);
};
