'use strict';

var request = require('request');

module.exports = function (state, _, cb) {
    var conf   = state.conf
      , fields = [ 'author.name', 'author.login', 'description', 'name' ]
      , url    = conf('vplugs:api:fetch');

    request({
        url    : url
      , method : 'GET'
      , qs     : { isPlugin : true, fields : fields.join('~') }
      , json   : true
    }, function (err, _, body) {
        state.data = body;
        cb(err);
    });
};
