var request = require('request')
  , glob    = require('glob')
  , path    = require('path')
  , fs      = require('fs')
  , async   = require('async')
  , chalk   = require('chalk')
  , data    = path.join(__dirname, '../data')
  , config  = require('../conf/github.json');

function runSearch (page) {
    var file = path.join(data, 'search.' + page + '.json')
      , opts = {
            url     : 'https://api.github.com/search/repositories'
          , method  : 'GET'
          , qs      : { q: 'vim', sort: 'stars', order: 'desc', page: page }
          , headers : {
                'Authorization' : 'token ' + config.token
              , 'User-Agent'    : 'Ayne-Finder/0.0.1'
              , 'Accept'        : '*/*'
            }
        };

    if (fs.existsSync(file) && require('./' + file).items) {
        return;
    }

    request(opts)
       .on('response', function (res) {
            console.log(res.headers);
        })
       .on('error', function (err) {
            console.log(err);
        })
       .pipe(fs.createWriteStream(file));
}



// for (var i = 1; i < 35; i++) {
// runSearch(i);
// }

var urls = [];

glob(path.join(data, '*'), function (err, files) {
    async.eachSeries(files, function (f, next) {
        var json  = require(f)
          , items = json.items || [];

        urls = urls.concat(items.map(function (x) { return x.clone_url; }));
        console.log(chalk.blue(f), items.length, urls.length);

        async.each(items, function (item, next2) {
            var data  = {
                    name            : item.name
                  , author          : item.owner.login        // TODO: get the owner's name with item.owner.url
                  , description     : item.description
                  , githubUrl       : item.html_url
                  , githubStarCount : item.stargazers_count
                };

            request({
                url    : 'http://localhost:8006/vplugs'
              , method : 'POST'
              , body   : data
              , json   : true
            }, function () {
                next2();
            });
        }, function () {
            next();
        });
    }, function () {
        urls.sort(function (a, b) { return a.localeCompare(b); });
        urls.forEach(function (url) {
            console.log(url);
        });
    });
});
