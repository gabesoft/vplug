'use strict';

var request = require('request')
  , chalk   = require('chalk');

module.exports = function (state, _, cb) {
    var conf      = state.conf
      , fields    = [ 'author.name', 'author.login', 'description', 'isPlugin', 'name' ]
      , url       = conf('vplugs:api:fetch')
      , threshold = conf('vplugs:threshold');

    request({
        url    : url
      , method : 'GET'
      , qs     : { fields : fields.join('~'), isPlugin : threshold }
      , json   : true
    }, function (err, _, body) {
        state.log.info('found ' + chalk.blue((body || []).length) + ' data items');
        state.data = body;
        cb(err);
    });
};
