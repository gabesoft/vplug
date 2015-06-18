'use strict';

var request = require('request')
  , async   = require('async')
  , chalk   = require('chalk');

function upload (state, chunk, cb) {
    var conf = state.conf
      , url  = conf('keywords:api:save')
      , all  = state.keywords.length;

    state.log.info('uploading ' + chalk.blue(chunk.current) + ' of ' + chalk.green(all) + ' keywords');
    request({
        url    : url
      , method : 'POST'
      , json   : true
      , body   : chunk.data
    }, cb);
}

module.exports = function (state, _, cb) {
    var conf     = state.conf
      , chunklen = conf('keywords:chunklen')
      , keywords = state.keywords
      , chunk    = null
      , chunks   = []
      , i        = 0
      , len      = keywords.length;

    for (i = 0; i < len; i += chunklen) {
        chunk = keywords.slice(i, i + chunklen);
        chunks.push({
            current : i + chunk.length
          , data    : chunk
        });
    }

    async.eachSeries(chunks, function (chunk, next) {
        upload(state, chunk, next);
    }, cb);
};
