'use strict';

var path   = require('path')
  , mkdirp = require('mkdirp')
  , chalk  = require('chalk')
  , fs     = require('fs')
  , util   = require('util')
  , md5    = require('../core/md5_hash');

function getHash (options) {
    var opts = util._extend({}, options);
    delete opts.page;
    return md5.create(JSON.stringify(opts));
}

module.exports = function (state, options, cb) {
    if (!state.root) { return cb(new Error('No root directory specified')); }

    var root = path.join(state.root, 'data')
      , opts = state.originalOptions
      , hash = getHash(opts)
      , dir  = path.join(root, hash)
      , file = 'result.' + opts.page + '.json';

    state.destination = path.join(dir, file);
    state.log.info('destination file ' + chalk.green(path.join(hash, file)));

    mkdirp(dir, function (err) {
        fs.writeFile(path.join(dir, 'options.json')
          , JSON.stringify(state.originalOptions, null, 4)
          , cb);
    });
};
