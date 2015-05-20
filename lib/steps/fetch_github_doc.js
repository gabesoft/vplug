'use strict';

var cache   = require('../cache')
  , util    = require('util')
  , Request = require('../core/github_request').GithubRequest
  , chalk   = require('chalk');

module.exports = function (state, _, cb) {
    if (state.githubDoc) { return cb(); }

    var files   = util.isArray(state.githubDocFiles) ? state.githubDocFiles : []
      , request = null
      , fileUrl = null;

    files.forEach(function (file) {
        if (fileUrl) { return; }

        if (file && file.name.match(/^.+\.txt$/)) {
            fileUrl = file.url;
        }
    });

    if (!fileUrl) { return cb(); }

    request = new Request({
        url     : fileUrl
      , headers : state.githubRequestHeaders
    }, state.log);

    request.get(function (err, body) {
        if (err) {
            state.log.error(err.stack || err.message);
            cb(err);
        } else {
            state.githubDoc = body;
            state.log.info(cache.missString('doc')  + ' ' + state.githubDocUrl);
            cb();
        }
    });
};
