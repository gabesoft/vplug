'use strict';

var cache  = {}
  , mkdirp = require('mkdirp')
  , fs     = require('fs')
  , chalk  = require('chalk')
  , path   = require('path')
  , md5    = require('./core/md5-hash')
  , root   = path.join(__dirname, '..', 'cache');

function key (input) {
    return md5.create(input || '[null]');
}

function filePath (type, key) {
    return path.join(root, type, key + '.json');
}

function setLocal (type, key, v) {
    cache[type] = cache[type] || {};
    cache[type][key] = v;
}

function getLocal (type, key) {
    return (cache[type] || {})[key];
}

function save (type, key, data, cb) {
    var file = filePath(type, key)
      , dir  = path.dirname(file);

    mkdirp(dir, function (err) {
        if (err) { return err; }

        fs.writeFile(file, JSON.stringify(data), cb);
    });
}

function read (type, key, cb) {
    fs.readFile(filePath(type, key), { encoding : 'utf8' }, function (err, data) {
        if (err) { return cb(err); }
        if (!data) { return cb(); }
        cb(null, JSON.parse(data));
    });
}

function has (type, k, cb) {
    var v = getLocal(type, key(k));

    if (typeof v !== 'undefined') {
        return cb(null, true);
    }

    read(type, key(k), function (err, data) {
        if (err || !data) {
            cb(null, false);
        } else {
            setLocal(type, key(k), data);
            cb(null, true);
        }
    });
}

function get (type, k, cb) {
    has(type, k, function (err, h) {
        cb(null, h ? getLocal(type, key(k)) : null);
    });
}

function set (type, k, v, cb) {
    var curr = getLocal(type, key(k));

    save(type, key(k), v, function (err) {
        if (err) { return cb(err); }

        setLocal(type, key(k), v);
        cb();
    });
}

function hitString (type) {
    return 'cache ' + chalk.green('hit  ') + '(' + type + ')';
}

function missString (type) {
    return 'cache ' + chalk.yellow('miss ') + '(' + type + ')';
}

module.exports = {
    get        : get
  , set        : set
  , has        : has
  , missString : missString
  , hitString  : hitString
};
