// Uploads the search results into the database

var urls = []
  , glob    = require('glob')
  , fs      = require('fs')
  , async   = require('async')
  , chalk   = require('chalk');

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
