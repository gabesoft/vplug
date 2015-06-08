'use strict';

module.exports = function (state, _, cb) {
    state.githubContentsUrl = state.item.contents_url.replace(/\{\+path\}/, '');
    cb();
};
