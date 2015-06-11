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
    return pre + ':' + (raw ? k : md5.create(k));
}

Cache.prototype.set = function (type, k, v, forever, cb) {
    if (!cb) { throw new Error('No callback specified'); }

    var k = key(type, k)
      , v = JSON.stringify(v || {});

    if (forever) {
        this.redis.set(k, v, cb);
    } else {
        this.redis.set(k, v, expire, cb);
    }
};

Cache.prototype.get = function (type, k, cb) {
    if (!cb) { throw new Error('No callback specified'); }

    this.redis.get(key(type, k), cb);
};

Cache.prototype.keys = function (type, cb) {
    if (!cb) { throw new Error('No callback specified'); }

    this.redis.keys(key(type, '*', true), cb);
};

module.exports.Cache = Cache;
