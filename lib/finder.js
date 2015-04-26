var request = require('request')
  , path    = require('path')
  , mkdirp  = require('mkdirp')
  , async   = require('async')
  , chalk   = require('chalk')
  , fs      = require('fs')
  , data    = path.join(__dirname, '../data')
  , config  = require('../conf/github.json')
  , stars   = [ '>=100', '40..99', '30..39', '20..29', '13..19', '9..12', '7..8', '6', '5', '4', '3', '2', '1', '0' ];

function filePath (page, stars) {
    var dir = 'src:' + stars.replace(/\.+/g, '-').replace(/[><=]+/g, '-');
    return path.join(data, dir, 'res-' + page + '.json');
}

function runSearch (page, stars, cb) {
    var file = filePath(page, stars)
      , opts = {
            url     : 'https://api.github.com/search/repositories'
          , method  : 'GET'
          , qs      : { q : 'vim in:name,description,readme language:vimscript stars:' + stars, page: page }
          , headers : {
                'Authorization' : 'token ' + config.token
              , 'User-Agent'    : 'Ayne-Finder/0.0.1'
              , 'Accept'        : '*/*'
            }
        };

    mkdirp.sync(path.dirname(file));

    console.log(chalk.blue('running search ' + page + ' ' + stars));

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

function run () {
    async.eachSeries(stars, function (s, next) {
        console.log(chalk.magenta('starting stars range ' + s));

        var cont = function (err, info) {
                if (err) {
                    console.log(chalk.red(err.message));
                    return next();
                }

                if (info.remaining === 0) {
                    (function (info) {
                        console.log(chalk.yellow('waiting for limit reset'));
                        setTimeout(function () {
                            runSearch(info.next, s, cont);
                        }, info.timeout + 100);
                    })(info);
                    return;
                }

                if (!info.next) {
                    return next(err);
                }

                return runSearch(info.next, s, cont);

                // (function (info) {
                // setTimeout(function () {
                // runSearch(info.next, s, cont);
                // }, info.remaining + 100);
                // })(info);
            };

        runSearch(1, s, cont);
    });
}

run();
