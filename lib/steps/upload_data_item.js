'use strict';

var request  = require('request')
  , convert  = require('../core/repo_contents_to_train_data')
  , vimfiles = [ 'vimfiles', 'vim', '.vim', 'dotfiles', 'dotvim' ]
  , chalk    = require('chalk');

function getContent (data) {
    return data ? { content : data.content, encoding : data.encoding } : null;
}

function computeCertainty (state) {
    if (state.known.plugins.indexOf(state.item.html_url) !== -1) {
        return 1;
    }

    if (state.known.other.indexOf(state.item.html_url) !== -1) {
        return 0;
    }

    if (vimfiles.indexOf((state.item.name || '').toLowerCase()) !== -1) {
        return 0;
    }

    var data   = convert(state.githubContents)
      , output = state.runNet(data);
    return output.plugin || 0;
}

module.exports = function (state, _, cb) {
    var item      = state.item
      , threshold = +state.conf('vplugs:threshold')
      , count     = 0
      , retry     = 10
      , body      = {
            name            : item.name
          , author          : state.githubUser
          , description     : item.description
          , githubCloneUrl  : item.clone_url
          , githubSshUrl    : item.ssh_url
          , githubHtmlUrl   : item.html_url
          , githubStarCount : item.stargazers_count
          , githubCreatedAt : item.created_at
          , githubUpdatedAt : item.updated_at   // date and time of the last change
          , githubPushedAt  : item.pushed_at    // date and time of the last commit
          , readme          : getContent(state.githubReadme)
          , isPlugin        : computeCertainty(state)
          , doc             : getContent(state.githubDoc)
        };

    (function upload (err) {
        if (count > retry) { return cb(err); }
        if (body.isPlugin < threshold) { return cb(); }

        request({
            url : state.conf('vplugs:api:create')
          , method : 'POST'
          , body : body
          , json : true
        }).on('error', function (err) {
            state.log.error('retry ' + chalk.red(count));
            state.log.error(err.stack);
            if (err.code === 'ECONNRESET' || err.code === 'ECONNREFUSED') {
                count = count + 1;
                setTimeout(function () { upload(err); }, 100);
            } else {
                cb(err);
            }
        }).on('response', function (response) {
            cb();
        });
    })();
};
