'use strict';

var request = require('request')
  , path    = require('path')
  , mkdirp  = require('mkdirp')
  , moment  = require('moment')
  , async   = require('async')
  , chalk   = require('chalk')
  , fs      = require('fs')
  , data    = path.join(__dirname, '../data')
  , config  = require('../conf/github.json');

// TODO: parameterize finder
//       - search repos by keyword
//       - by star rating
//       - since date
//       - autors info
//       - commits info

function filePath (page, date) {
    var dir = 'src:' + date;
    return path.join(data, dir, 'res-' + page + '.json');
}

function getDate (sinceDays) {
    return moment().subtract(sinceDays, 'days').format('YYYY-MM-DD');
}

function runSearch (page, date, cb) {
    var file = filePath(page, date)
      , opts = {
            url     : 'https://api.github.com/search/repositories'
          , method  : 'GET'
          , qs      : { q : 'vim in:name,description,readme language:vimscript created:>=' + date, page: page }
          , headers : {
                'Authorization' : 'token ' + config.token
              , 'User-Agent'    : 'Ayne-Finder/0.0.1'
              , 'Accept'        : '*/*'
            }
        };

    mkdirp.sync(path.dirname(file));

    console.log(chalk.blue('running search ' + page + ' ' + date));

    request(opts)
       .on('response', function (res) {
            console.log(res.headers);
            var remaining = res.headers['x-ratelimit-remaining']
              , reset     = res.headers['x-ratelimit-reset'] * 1000
              , timeout   = reset - Date.now()
              , links     = (res.headers.link || '').split(',')
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

            console.log(info);
            cb(null, info);
        })
       .on('error', function (err) {
            console.log(err);
            cb(err);
        })
       .pipe(fs.createWriteStream(file));
}

runSearch(1, getDate(13), function (err, info) {
    console.log(err, info);
});
