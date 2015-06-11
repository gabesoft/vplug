'use strict';

var md5     = require('./core/md5_hash')
  , conf    = require('../conf/store')
  , moment  = require('moment')
  , pre     = conf.get('redis:prefix')
  , exValue = conf.get('redis:expire:value')
  , exUnit  = conf.get('redis:expire:unit')
  , expire  = moment.duration(exValue, exUnit).asSeconds();

function Cache (redis) {
    this.redis = redis;
}

function key (type, k, raw) {
    k = k || '[null]';
    return pre + ':' + type + ':' + (raw ? k : md5.create(k));
}

Cache.prototype.set = function (type, k, v, forever, cb) {
    if (!cb) { throw new Error('No callback specified'); }

    k = key(type, k);
    v = JSON.stringify(v || {});

    if (forever) {
        this.redis.set(k, v, cb);
    } else {
        this.redis.setex(k, expire, v, cb);
    }
};

Cache.prototype.get = function (type, k, cb) {
    if (!cb) { throw new Error('No callback specified'); }

    this.redis.get(key(type, k), cb);
};

Cache.prototype.values = function (type, cb) {
    if (!cb) { throw new Error('No callback specified'); }

    // TODO: instead of using redis.keys
    //       store the keys in a set per type and get them that way
    this.redis.keys(key(type, '*', true), function (err, keys) {
        if (err) { return cb(err); }

        var multi = this.redis.multi();

        keys.forEach(function (k) {
            multi.get(k);
        });

        multi.exec(function (err, data) {
            if (err) {
                cb(err);
            } else {
                cb(null, data.map(JSON.parse));
            }
        });
    }.bind(this));
};

module.exports.Cache = Cache;
