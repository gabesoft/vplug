'use strict';

module.exports = function (state, _, cb) {
    if (state.githubDocCached) { return cb(); }
    if (!state.githubHtmlUrl) { return cb(new Error('No html url specified')); }

    var url = state.githubHtmlUrl
      , doc = state.githubDoc || { message : 'Doc file not found', url : url };

    state.cache.set('doc', url, doc, false, cb);
};
