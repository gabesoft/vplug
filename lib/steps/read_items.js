'use strict';

var chalk = require('chalk');

module.exports = function (state, options, cb) {
    var items = {};

    state.files.forEach(function (file) {
        require(file).items.forEach(function (item) {
            items[item.url] = item;
        });
    });

    state.items = [];
    Object.keys(items).forEach(function (key) {
        state.items.push(items[key]);
    });

    state.log.info('item count ' + chalk.blue(state.items.length));
    cb();
};
