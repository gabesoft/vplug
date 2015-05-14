'use strict';

var request = require('request')
  , fs      = require('fs');

module.exports = function (state, options, cb) {
    var file   = state.destination
      , stream = fs.createWriteStream(file);

    state.log.info('starting search');

    request(state.requestOptions)
       .on('response', function (res) {
            state.responseHeaders = res.headers;
        })
       .on('error', function (err) {
            cb(err);
        })
       .pipe(stream);

    stream.on('finish', cb);
};
