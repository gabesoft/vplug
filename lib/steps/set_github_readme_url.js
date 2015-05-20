'use strict';

module.exports = function (state, _, cb) {
    var url  = state.item.contents_url;

    url = url.replace(/contents\/[^/]+$/, '');
    url = url + 'readme';

    state.githubReadmeUrl = url;
    cb();
};
