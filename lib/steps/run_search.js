'use strict';

var request = require('request')
  , fs      = require('fs');

module.exports = function (state, options, cb) {
    state.log.info('starting search');

    request(state.requestOptions, function (error, response, body) {
        if (error) { return cb(error); }

        state.responseHeaders = response.headers;
        state.responseBody = response.body;

        cb();
    });
};
