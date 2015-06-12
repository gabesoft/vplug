'use strict';

var chalk = require('chalk');

module.exports = function (state, _, cb) {
    if (!state.githubHtmlUrl) { return cb(new Error('No html url found')); }

    state.cache.get('contents', state.githubHtmlUrl, function (err,  contents) {
        if (contents) {
            state.githubContents = contents;
            state.githubContentsCached = true;
        }
        cb();
    });
};
