'use strict';

module.exports = function (state, _, cb) {
    state.githubRequestHeaders = {
        'User-Agent'    : state.conf('userAgent')
      , 'Authorization' : 'token ' + state.conf('github:token')
      , 'Accept'        : '*/*'
    };
    cb();
};
