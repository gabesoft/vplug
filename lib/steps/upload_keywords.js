'use strict';

var request = require('request')
  , chalk   = require('chalk');

module.exports = function (state, _, cb) {
    var conf = state.conf
      , url  = conf('keywords:api:save');

    state.log.info('uploading ' + chalk.blue(state.keywords.length) + ' keywords');
    request({
        url    : url
      , method : 'POST'
      , json   : true
      , body   : state.keywords
    }, cb);
};
