'use strict';

module.exports = function (state, options, cb) {
    options.fileData = require(options.filePath);
    cb();
};
