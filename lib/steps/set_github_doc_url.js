'use strict';

module.exports = function (state, _, cb) {
    var url = state.item.contents_url;
    url = url.replace(/\{\+path\}/, 'doc');
    state.githubDocUrl = url;
    cb();
};
