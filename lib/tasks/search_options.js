'use strict';

var moment = require('moment');

function parseRange (input) {
    var range = input.split('..'), result = {};

    if (range.length === 1) {
        result.start = parseInt(range[0], 10);
        result.end   = parseInt(range[0], 10);
    } else {
        if (range[0].length > 0) {
            result.start = parseInt(range[0], 10);
        }
        if (range[1].length > 0) {
            result.end = parseInt(range[1], 10);
        }
    }

    return result;
}

function getRanges (range, step) {
    var results = []
      , start   = range.start || 0
      , end     = start;

    if ((range.start || 0) < (range.end || 0) && step > 0) {
        while (start <= range.end) {
            end = Math.min(range.end, end + step);
            results.push({ start : start, end : end });
            start = end + 1;
        }
    } else {
        results.push(range);
    }

    return results;
}

function parseNumbers (input, opts) {
    var parts = input.split('|')
      , range = parseRange(parts[0])
      , step  = parseInt(parts[1] || 0)
      , stars = []
      , ranges = null;

    if (step >= 0) {
        stars = stars.concat(getRanges(range, step));
    } else {
        ranges = getRanges({ start : range.end, end : range.start }, -step);
        ranges.forEach(function (r) {
            stars.push({ start : r.end, end : r.start });
        });
    }

    return stars;
}

function parseDates (input, opts) {
    return parseNumbers(input, opts).map(function (data) {
        data.start = moment().subtract(data.start || 0, 'days');
        data.end = moment().subtract(data.end || 0, 'days');
        return data;
    });
}

module.exports.parse = function (input) {
    var parts   = (input || '').split(',')
      , fork    = false
      , stars   = []
      , created = []
      , results = [];

    parts.forEach(function (p) {
        if (p === 'f') {
            fork = true;
            return;
        }

        var items = p.split(':');

        if (items[0] === 's') {
            stars = stars.concat(parseNumbers(items[1]));
        } else if (items[0] === 'd') {
            created = created.concat(parseDates(items[1]));
        }
    });

    if (created.length === 0) {
        stars.forEach(function (s) {
            results.push({ stars : s, fork : fork });
        });
    } else if (stars.length === 0) {
        created.forEach(function (c) {
            results.push({ created : c, fork : fork });
        });
    } else {
        stars.forEach(function (s) {
            created.forEach(function (c) {
                results.push({ stars : s, created : c, fork : fork });
            });
        });
    }

    return results;
};
