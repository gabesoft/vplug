'use strict';

var path   = require('path')
  , util   = require('util')
  , Logger = require('srunner/logger').Logger
  , moment = require('moment')
  , log    = new Logger()
  , chalk  = require('chalk')
  , root   = path.join(__dirname, '../../')
  , async  = require('async');

function Runner (options) {
    this.interval = options.interval;
}

function buildTasks (data) {
    var runner = require(path.join(root, data.runner))
      , parser = null
      , tasks  = [];

    if (!data.options) {
        tasks.push(function (cb) {
            runner(cb);
        });
    } else {
        parser = require(path.join(root, data.parser));
        data.options.forEach(function (o) {
            parser.parse(o).forEach(function (options) {
                tasks.push(function (cb) {
                    runner(options, cb);
                });
            });
        });
    }

    return tasks;
}

Runner.prototype.loadTasks = function () {
    var file  = path.join(__dirname, '../data/tasks.json')
      , tasks = require(file);

    this.tasks = {};
    this.runOrder = [];

    Object.keys(tasks.def).forEach(function (name) {
        this.tasks[name] = buildTasks(tasks.def[name]);
    }.bind(this));

    tasks.run.forEach(function (t) {
        this.runOrder.push(util.isArray(t) ? t : [t]);
    }.bind(this));

    log.info('tasks loaded ' + chalk.blue(Object.keys(this.tasks).length));
};

Runner.prototype.logTasks = function (name, msg) {
    var tasks = this.tasks[name];
    log.info('task ' + chalk.magenta(name) + ' ' + chalk.blue(tasks.length) + ' ' + msg);
};


Runner.prototype.runTasks = function (cb) {
    var series   = []
      , parallel = [];

    this.runOrder.forEach(function (names) {
        if (names.length === 1) {
            this.logTasks(names[0], 'series');
            series = series.concat(this.tasks[names[0]]);
        } else {
            parallel = names.reduce(function (acc, name) {
                this.logTasks(name, 'parallel');
                return acc.concat(this.tasks[name]);
            }.bind(this), []);

            series.push(function (next) {
                async.parallel(parallel, next);
            }.bind(this));
        }
    }.bind(this));

    async.series(series, cb);
};

Runner.prototype.startRunLoop = function () {
    log.info(chalk.magenta('starting tasks'));

    var duration = moment.duration(this.interval).humanize();
    this.runTasks(function (err) {
        if (err) {
            log.error(err.message);
        } else {
            log.info('tasks complete ... going to sleep for ' +
                chalk.blue(duration) + ' from ' +
                chalk.yellow(moment().format('hh:mm:ss')));
        }
        setTimeout(this.startRunLoop.bind(this), this.interval);
    }.bind(this));
};

module.exports.Runner = Runner;
