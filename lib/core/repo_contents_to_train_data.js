'use strict';

var VIM_DIRS = [ 'autoload', 'doc', 'ftplugin', 'indent', 'plugin', 'syntax', 'after' ]
  , util     = require('util');

function getNames (contents, type) {
    contents = util.isArray(contents) ? contents : [];
    return (contents || [])
       .filter(function (c) {
            return c.type === type;
        })
       .map(function (c) {
            return c.name;
        });
}

function has (items, item) {
    return (items.indexOf(item) !== -1) ? 1 : 0;
}

function hasr (items, re) {
    return (items.some(function (x) { return x.match(re); })) ? 1 : 0;
}

/**
 * Returns the percentage of vim directories over all directories
 *
 * @param {Array} dirs
 */
function vperc (dirs) {
    var all = dirs.length
      , vim = VIM_DIRS
           .map(function (d) { return has(dirs, d); })
           .reduce(function (acc, x) { return acc + x; }, 0);

    return vim / all;
}

module.exports = function (contents) {
    var files = getNames(contents, 'file')
      , dirs  = getNames(contents, 'dir')
      , data  = null;

    data =  {
        vperc    : vperc(dirs)
      , lib      : has(dirs, 'lib')
      , vimdir   : has(dirs, 'vim')
      , colors   : has(dirs, 'colors')
      , spec     : has(dirs, 'spec')
      , test     : has(dirs, 'test')
      , t        : has(dirs, 't')
      , snippets : has(dirs, 'snippets')
      , vimrc    : hasr(files, /^\.?vimrc$/)
      , elisp    : hasr(files, /^.+\.el$/)
      , vim      : hasr(files, /^.+\.vim$/)
    };

    VIM_DIRS.forEach(function (d) {
        data[d] = has(dirs, d);
    });

    return data;
};