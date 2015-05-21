'use strict';

var request = require('request');

module.exports = function (state, _, cb) {
    var conf = state.conf
      , url  = conf('keywords:api:save');

    request({
        url    : url
      , method : 'POST'
      , json   : true
      , body   : state.keywords
    }, cb);
};
