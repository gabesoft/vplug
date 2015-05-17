'use strict';

var chalk = require('chalk')
  , eyes  = require('eyes');

function displayCounts (state) {
    try {
        var data = require(state.destination)
          , total = data.total_count
          , count = (state.count || 0) + (data.items || []).length;
        state.log.info('current count: ' + chalk.magenta(count) + '/' + chalk.magenta(total));
        state.count = count;
    } catch (e) {
        state.log.error(e);
    }
}

module.exports = function (state, options, cb) {
    if (!state.responseHeaders) { cb(new Error('No headers object found')); }

    var headers   = state.responseHeaders
      , remaining = headers['x-ratelimit-remaining']
      , reset     = headers['x-ratelimit-reset'] * 1000
      , timeout   = reset - Date.now()
      , links     = (headers.link || '').split(',')
      , pagePat   = /page=(\d+)/
      , relPat    = /rel="([^"]+)"/
      , rel0      = (relPat.exec(links[0]) || [])[1]
      , rel1      = (relPat.exec(links[1]) || [])[1]
      , page0     = (pagePat.exec(links[0]) || [])[1]
      , page1     = (pagePat.exec(links[1]) || [])[1]
      , info      = {
            remaining : +remaining
          , reset     : reset
          , timeout   : timeout
        };

    info[rel0] = page0;
    info[rel1] = page1;

    state.responseInfo = info;

    displayCounts(state);

    cb();
};
