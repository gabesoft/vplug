'use strict';

var brain = require('brain')
  , net   = new brain.NeuralNetwork();

module.exports = function (state, _, cb) {
    net.train(state.trainData, {
        errorThresh  : 0.004   // error threshold to reach
      , iterations   : 30000   // maximum training iterations
      , log          : true    // console.log() progress periodically
      , logPeriod    : 1000    // number of iterations between logging
      , learningRate : 0.3     // learning rate
    });

    state.trainResults = net.toJSON();
    cb();
};
