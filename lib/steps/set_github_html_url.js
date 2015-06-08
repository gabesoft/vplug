'use strict';

module.exports = function (state, _, cb) {
    state.githubHtmlUrl = state.item.html_url;
    cb();
};
