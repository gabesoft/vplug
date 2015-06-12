'use strict';

var util    = require('util')
  , async   = require('async')
  , convert = require('../core/repo_contents_to_train_data')
  , Request = require('../core/github_request').GithubRequest
  , chalk   = require('chalk');

function addToData (state, urls, data, output, cb) {
    async.each(urls, function (url, next) {
        state.cache.get('contents', url, function (err, contents) {
            if (err) { return next(err); }

            if (!contents) {
                state.log.warn('data not found for ' + chalk.yellow(url));
                return next();
            }

            data.push({
                input  : convert(contents)
              , output : output
            });

            next();
        });
    }, cb);
}

module.exports = function (state, _, cb) {
    var urls = state.trainUrls
      , data = [];

    addToData(state, urls.plugins, data, { plugin : 1 }, function (err) {
        if (err) { return cb(err); }

        addToData(state, urls.other, data, { other : 1 }, function (err) {
            if (err) { return cb(err); }

            state.trainData = data;
            cb();
        });
    });
};
