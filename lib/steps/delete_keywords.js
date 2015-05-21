'use strict';

var request = require('request');

module.exports = function (state, _, cb) {
    var conf = state.conf
      , url  = conf('keywords:api:delete');

    request({
        url    : url
      , method : 'DELETE'
      , json   : true
    }, cb);
};

