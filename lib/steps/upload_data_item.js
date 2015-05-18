'use strict';

var request = require('request')
  , chalk   = require('chalk');

module.exports = function (state, options, cb) {
    var item  = state.item
      , count = 0
      , retry = 10
      , body  = {
            name            : item.name
          , author          : state.githubUser
          , description     : item.description
          , githubCloneUrl  : item.clone_url
          , githubUrl       : item.html_url
          , githubStarCount : item.stargazers_count
        };

    (function upload (err) {
        if (count > retry) { return cb(err); }

        request({
            url : state.conf('vplugs:api:create')
          , method : 'POST'
          , body : body
          , json : true
        }).on('error', function (err) {
            state.log.error('retry ' + chalk.red(count));
            state.log.error(err.stack);
            if (err.code === 'ECONNRESET' || err.code === 'ECONNREFUSED') {
                count = count + 1;
                setTimeout(function () { upload(err); }, 100);
            } else {
                cb(err);
            }
        }).on('response', function (response) {
            cb();
        });
    })();
};
