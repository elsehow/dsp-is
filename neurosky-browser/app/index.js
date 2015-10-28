
// big q's:
//
//   how to render a spectrogram wherever?
//   what to wrap this in, and how?
//   how to describe thse path in data? 
//

// answers:
//
//   higher-order function draw
//   ???
//   silly! code *is* data.... 
//     so, youre asking the same q you (should) always ask!
//

//patches
var Bandpass = require('./patches/Bandpass.js')
var Averager = require('./patches/Averager.js')

// combinators
var Ratio = require('./combinators/Ratio.js')
var StandardDevThreshold = require('./combinators/StandardDevThreshold.js')

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

  // average alpha power
  var alpha = stream
    .map(Bandpass('alpha'))
    .map(Averager)
   
  // average delta power
  var beta = stream
    .map(Bandpass('beta'))
    .map(Averager)
  
  // ratio between alpha and delta
  var alphaBetaRatio = alpha
    .combine(beta, Ratio) 
  
  // spike detection
  var spikes = alphaBetaRatio
    .combine(
      alphaBetaRatio.slidingWindow(1000).map(require('lodash').flatten)
    , StandardDevThreshold(-1))

}
