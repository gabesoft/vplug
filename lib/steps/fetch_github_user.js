'use strict';

var request = require(request)
  , chalk   = require('chalk');

module.exports = function (state, options, cb) {
    var data = state.fileData
      , conf = state.conf
      , url  = data.owner.url;

    request({
        url     : url
      , method  : 'GET'
      , json    : true
      , headers : {
            'User-Agent' : conf('userAgent')
          , 'Accept'     : '*/*'
        }
    }).on('response', function (res, body) {
        state.githubUser = body;
        state.log.info('github user ' + chalk.blue(body.login) + ' (' + chalk.magenta(body.name) + ')');
        cb();
    }).on('error', function (err) {
        state.log.error(err.message);
        cb(err);
    });
};
