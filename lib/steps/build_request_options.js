'use strict';

var chalk = require('chalk')
  , fs    = require('fs');

function nil (x) {
    return typeof x === 'undefined';
}

function formatDate (date) {
    // Date is expected to be a moment object
    return date ? date.format('YYYY-MM-DD') : '';
}

function getStars (lo, hi) {
    if (nil(lo) && nil(hi)) { return ''; }

    if (nil(hi)) {
        return 'stars:>=' + lo;
    }
    if (nil(lo)) {
        return 'stars:<' + hi;
    }
    return 'stars:' + lo + '..' + hi;
}

function getCreated (start, end) {
    if (nil(start) && nil(end)) {
        return '';
    } else {
        return 'created:' + formatDate(start) + '..' + formatDate(end);
    }
}

module.exports = function (state, options, cb) {
    var conf   = state.conf
      , opts   = state.originalOptions
      , query  = { page : opts.page };

    query.q = 'vim in:name,description,readme';

    if (opts.stars) {
        query.q += ' ' + getStars(opts.stars.lo, opts.stars.hi);
    }

    if (opts.created) {
        query.q += ' ' + getCreated(opts.created.start, opts.created.end);
    }

    if (opts.fork) {
        query.q += ' fork:true'
    }

    state.requestOptions  = {
        url     : conf('github:api:search')
      , method  : 'GET'
      , qs      : query
      , json    : true
      , headers : {
            'Authorization' : 'token ' + conf('github:token')
          , 'Accept'        : '*/*'
          , 'User-Agent'    : 'Ayne-Finder/0.0.1'
        }
    };

    state.log.info(chalk.yellow(query.q));

    cb();
};
