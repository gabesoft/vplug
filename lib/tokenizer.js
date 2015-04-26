var request = require('request')
  , natural = require('natural');

var stopStr = "a,able,about,across,after,all,almost,also,am,among,an,and,any,are,as,at,be,because,been,but,by,can,cannot,could,dear,did,do,does,either,else,ever,every,for,from,get,got,had,has,have,he,her,hers,him,his,how,however,i,if,in,into,is,it,its,just,least,let,like,likely,may,me,might,more,most,much,must,my,neither,no,nor,not,of,off,often,on,only,or,other,our,own,rather,said,say,says,she,should,since,so,some,than,that,the,their,them,then,there,these,they,this,tis,to,too,twas,us,wants,was,we,were,what,when,where,which,while,who,whom,why,will,with,would,yet,you,your";
var stopWords = {};

stopStr.split(',').forEach(function (word) {
    stopWords[word] = true;
});

function isNumber (word) {
    var pat = new RegExp(/^\d+$/);
    return pat.test(word);
}

function getData (cb) {
    // TODO: use a config for url, etc
    var options = {
            uri    : 'http://localhost:8006/vplugs'
          , method : 'GET'
          , json   : true
        };

    request(options, function (err, response, body) {
        cb(err, body);
    });
}

function tokenize (stemmer, data, cb) {
    var keywords  = {}
      , tokenizer = new natural.WordTokenizer();

    data.forEach(function (item) {
        var name   = tokenizer.tokenize(item.name || '')
          , author = tokenizer.tokenize(item.author || '')
          , desc   = tokenizer.tokenize(item.description || '')
          , words  = name.concat(author).concat(desc);

        words.forEach(function (word) {
            word = word.toLowerCase();

            var stemmed = stemmer.stem(word);

            if (stemmed.length < 4) return;
            if (stopWords[stemmed]) return;
            if (isNumber(stemmed))  return;

            // TODO: the word count should be the number of plugins it appears into
            //       not the number of instances
            if (!keywords[stemmed]) {
                keywords[stemmed] = { words : [ word ], count : 1 }
            } else {
                keywords[stemmed].words.push(word);
                keywords[stemmed].count++;
            }
        });
    });

    cb(null, keywords);
}

function tokenizePorter (data, cb) {
    tokenize(natural.PorterStemmer, data, cb);
}

function tokenizeLancaster (data, cb) {
    tokenize(natural.LancasterStemmer, data, cb);
}

getData(function (err, data) {
    function print (err, keywords) {
        var arr = Object.keys(keywords)
               .map(function (k) {
                    var words = keywords[k].words.sort(function (a, b) {
                            return a.length - b.length;
                        });
                    return { key : k, name : words[0], count : keywords[k].count };
                })
               .sort(function (x, y) {
                    return x.count - y.count;
                });

        console.log(JSON.stringify(arr));
        // console.log(arr.length);
    }

    tokenizePorter(data, print);

    // tokenizePorter(data, function (err, keywords) {
        // print(keywords, 'PORTER');
    // });
    // tokenizeLancaster(data, function(err, keywords) {
        // print(keywords, 'LANCASTER');
    // });
});
