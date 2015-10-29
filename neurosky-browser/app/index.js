// patches
var Bandpass = require('./patches/Bandpass.js')
var Averager = require('./patches/Averager.js')

// combinators
var Ratio = require('./combinators/Ratio.js')
var StandardDevThreshold = require('./combinators/StandardDevThreshold.js')

// views
var Spectrogram = require('./views/Spectrogram.js')
var NumberView = require('./views/Number.js')

// this function takes a Kefir `stream`
// and a function `draw`.
//
// first, use the stream by `map`ping patches
//
//     stream.map(Averager)
//
// use combinators to diverge + combine the streams
//
//     alphaAverage.combine(betaAverage, Ratio)
//
// finally, use `draw` with views to graph the stream
//    
//     draw(alphaBetaRatio, Spectrogram, 'alpha/beta ratio')
//
module.exports = function (stream, draw) {

  // alpha bandpass
  var alpha = stream
    .map(Bandpass('alpha'))

  // average alpha power
  var avgAlpha = alpha.map(Averager)
   
  // beta bandpass
  var beta = stream
    .map(Bandpass('beta'))

  // average delta power
  var avgBeta = beta.map(Averager)
  
  // ratio between alpha and delta
  var alphaBetaRatio = avgAlpha.combine(avgBeta, Ratio) 
  
  // spike detection
  var spikes = alphaBetaRatio
    .combine(
      alphaBetaRatio.slidingWindow(1000).map(require('lodash').flatten)
    , StandardDevThreshold(2))

  // here we draw stuff
  
  draw(stream, Spectrogram, 'full spectrogram')
  
  draw(alpha, Spectrogram, 'alpha')

  draw(beta, Spectrogram, 'beta')

  //draw(avgAlpha, NumberView, 'average alpha')
  
  //draw(avgBeta, NumberView, 'average beta')
  
  draw(alphaBetaRatio, NumberView,  'ratio of alpha:beta power')

  draw(spikes, NumberView,  'spikes in alpha:beta ratio (+2 stdevs above mean for past 1000 spectra)')

}
