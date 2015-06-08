'use strict';

var runner = require('./runners/finder')
  , moment = require('moment')
  , eyes   = require('eyes')
  , args   = require('yargs')
       .usage('Usage: $0 [options]')
       .alias('l', 'lo')
       .describe('l', 'search all repos that have at least the given number of stars')
       .alias('i', 'hi')
       .describe('i', 'search all repos that have at most the given number of days')
       .alias('s', 'since')
       .describe('s', 'search all repos created since a given number of days')
       .alias('h', 'help')
       .describe('h', 'display usage')
  , argv = args.argv;

var opts = {
        created : {}
      , stars   : {}
    };

if (argv.h) {
    console.log(args.help());
    process.exit(1);
}

if (typeof argv.lo !== 'undefined') {
    opts.stars.lo = argv.lo;
}
if (typeof argv.hi !== 'undefined') {
    opts.stars.hi = argv.hi;
}
if (argv.s) {
    opts.created.end = moment();
    opts.created.start = moment().subtract(argv.s, 'days');
}

runner(opts);
