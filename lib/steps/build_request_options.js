function formatDate (date) {
    // Date is expected to be a moment object
    return date ? date.format('YYYY-MM-DD') : '';
}

function getStars (start, end) {
    if (!start && !end) { return ''; }
    if (!start) {
        return 'stars:>=' + end;
    }
    if (!end) {
        return 'stars:<' + start;
    }
    return 'stars:' + start + '..' + end;
}

function getCreated (start, end) {
    if (!start && !end) {
        return '';
    } else {
        return 'created:' + formatDate(start) + '..' + formatDate(end);
    }
}

module.exports = function (state, options, cb) {
    var conf   = state.conf
      , opts   = state.originalOptions
      , query  = { page : opts.page };

    query.q = 'vim in:name,description,readme language:vimscript';

    if (opts.stars) {
        query.q += ' ' + getStars(opts.stars.start, opts.stars.end);
    }

    if (opts.created) {
        query.q += ' ' + getCreated(opts.created.start, opts.created.end);
    }

    state.requestOptions  = {
        url     : conf('github:api:search')
      , method  : 'GET'
      , qs      : query
      , headers : {
            'Authorization' : 'token ' + conf('github:token')
          , 'Accept'        : '*/*'
          , 'User-Agent'    : 'Ayne-Finder/0.0.1'
        }
    };

    cb();
};
