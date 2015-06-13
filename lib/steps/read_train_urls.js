'use strict';

var path  = require('path')
  , chalk = require('chalk');

module.exports = function (state, _, cb) {
    var urls = require(path.join(state.root, 'lib/data/train_urls'));
    state.trainUrls = urls;
    state.log.info('found ' + chalk.blue(urls.plugins.length) + ' plugin urls');
    state.log.info('found ' + chalk.blue(urls.other.length) + ' other urls');
    cb();
};
