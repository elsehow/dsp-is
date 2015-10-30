//
//
//  TODO hot / live reload
//  TODO some pattern thats more fun for livecoding
//
//
//    options:
//     - patches are fns that take a stream and return a stream
//    problems:
//     - what is in the streams? (pass that problem up the stack)
//    opportunities:
//     - hopefully makes it easier to livecode bc you're just chaining Fns w/o thinking
//
//    options:
//     - extend Kefir streams with a fn .draw(fn, 'name')
//     problems:
//     - weird proprietary sublcassing? rather than an api?
//     - does this make it easier to livecode?
//     - are all the streams still containing lists of numbers?
//     opportunities:
//     - straight up manipulating streams, then ending them with .draw()
//     - hopefully this makes it easier to livecode bc you just 
//       take and return streams in order without thinking about it
//
//
//
// frankly, this "lists only" thing has already proven to be arbitrary/wierd
// different types ==> differnet processing strategies ==> different views
// if you understand, recombining can be easy.  how easy??
//
//
//
//
//
//
// this function takes a Kefir `stream`
// and a function `draw`.
//
// first, use the stream by `map`ping patches
//
//     stream.map(Averager)
//
// use combinators to diverge + combine the streams
//
//     alphaAverage.combine(deltaAverage, Ratio)
//
// finally, use `draw` with views to graph the stream
//    
//     draw(alphaBetaRatio, Spectrogram, 'alpha/delta ratio')

// patches
var Bandpass = require('./patches/Bandpass.js')
var Averager = require('./patches/Averager.js')

// combinators
var Ratio = require('./combinators/Ratio.js')
var StandardDevThreshold = require('./combinators/StandardDevThreshold.js')

// views
var Spectrogram = require('./views/Spectrogram.js')
var NumberView = require('./views/Number.js')

module.exports = function (stream, draw) {

  // alpha bandpass
  var alpha = stream.map(Bandpass('alpha'))

  // average alpha power
  var avgDelta = alpha.map(Averager)
   
  // delta bandpass
  var delta = stream.map(Bandpass('delta'))

  // average delta power
  var avgBeta = delta.map(Averager)
  
  // ratio between alpha and delta
  var alphaBetaRatio = avgDelta.combine(avgBeta, Ratio) 
  
  // spike detection
  var spikes = alphaBetaRatio
    .combine(
      alphaBetaRatio.slidingWindow(1000).map(require('lodash').flatten)
    , StandardDevThreshold(2))


  // here we draw stuff
  
  draw(stream, Spectrogram, 'full spectrogram')
  
  draw(alpha, Spectrogram, 'alpha')

  draw(delta, Spectrogram, 'delta')

  //draw(avgDelta, NumberView, 'average alpha')
  
  //draw(avgBeta, NumberView, 'average delta')
  
  draw(alphaBetaRatio, NumberView,  'ratio of alpha:delta power')

  draw(spikes, NumberView,  'spikes in alpha:delta ratio (+1 stdevs above mean for past 1000 spectra)')

}
