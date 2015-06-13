'use strict';

var brain = require('brain')
  , path  = require('path')
  , net   = new brain.NeuralNetwork();

module.exports = function (state, _, cb) {
    var file = path.join(state.root, 'lib/data/train_results')
      , json = require(file);

    net.fromJSON(json);
    state.runNet = net.toFunction();
    cb();
};
