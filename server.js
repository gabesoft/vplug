'use strict';

var Hapi     = require('hapi')
  , server   = new Hapi.Server({})
  , Logger   = require('srunner/logger').Logger
  , log      = new Logger()
  , chalk    = require('chalk')
  , conf     = require('./conf/store')
  , moment   = require('moment')
  , Runner   = require('./lib/tasks/runner').Runner
  , interval = moment.duration(
        conf.get('tasks:interval:value')
      , conf.get('tasks:interval:unit'))
  , intervalError = moment.duration(
        conf.get('tasks:interval-error:value')
      , conf.get('tasks:interval-error:unit'))
  , runner   = new Runner({
        interval      : interval.asMilliseconds()
      , intervalError : intervalError.asMilliseconds()
    });

server.connection({ port : conf.get('app:port') || 8007 });

server.start(function (err) {
    log.info('server started ' + chalk.green(server.info.uri));
    if (err) {
        console.log(err);
        throw err;
    } else {
        runner.loadTasks();
        runner.startRunLoop();
    }
});
