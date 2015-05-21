'use strict';

module.exports = function (state, _, cb) {
    var keywords = state.keywords;

    state.keywords = Object.keys(keywords)
       .map(function (k) {
            var words = keywords[k].words.sort(function (a, b) {
                    return a.length - b.length;
                });
            return { key : k, name : words[0], count : keywords[k].count };
        })
       .sort(function (x, y) {
            return x.count - y.count;
        });

    cb();
};
