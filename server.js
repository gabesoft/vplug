'use strict';

var server = new Hapi.Server({})
  , conf   = require(./conf/store);



server.connection({ port : conf.get('app:port') || 8007 });

server.start(function (err) {
    console.log('server started: ',  server.info.uri);
    if (err) {
        console.log(err);
        throw err;
    }
});
