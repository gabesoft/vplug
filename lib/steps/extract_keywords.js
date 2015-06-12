'use strict';

var natural   = require('natural')
  , stopWords = require('../core/stop_words.js');

function isNumber (word) {
    var pat = new RegExp(/^\d+$/);
    return pat.test(word);
}

module.exports = function (state, _, cb) {
    var data      = state.data
      , stemmer   = natural.PorterStemmer
      , tokenizer = new natural.WordTokenizer()
      , keywords  = {};

    data.forEach(function (item) {
        var name   = tokenizer.tokenize(item.name || '')
          , author = item.author || {}
          , login  = tokenizer.tokenize(author.login || '')
          , aname  = tokenizer.tokenize(author.name || '')
          , desc   = tokenizer.tokenize(item.description || '')
          , words  = name.concat(login).concat(aname).concat(desc)
          , seen   = {};

        words.forEach(function (word) {
            word = word.toLowerCase();

            var stemmed = stemmer.stem(word);

            if (stemmed.length < 4) { return; }
            if (stopWords[stemmed]) { return; }
            if (isNumber(stemmed))  { return; }

            if (!keywords[stemmed]) {
                keywords[stemmed] = { words : [ word ], count : 1 };
            } else {
                keywords[stemmed].words.push(word);

                if (!seen[stemmed]) {
                    keywords[stemmed].count++;
                }
            }

            seen[stemmed] = true;
        });
    });

    state.keywords = keywords;
    cb();
};
