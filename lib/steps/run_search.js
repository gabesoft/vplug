'use strict';

var request = require('request')
  , fs      = require('fs');

module.exports = function (state, options, cb) {
    var file   = state.destination
      , stream = fs.createWriteStream(file);

    state.log.info('starting search');

    request(state.requestOptions, function (error, response, body) {
        if (error) { return cb(error); }

        state.responseHeaders = response.headers;
        state.responseBody = response.body;

        cb();
    });
};
