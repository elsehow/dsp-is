var _ = require('lodash')
  , raws = require('./raw512.js')
  , Kefir = require('kefir')
  , fftjs = require('fft-js')
  , fft = fftjs.fft
  , fftUtil = fftjs.util
  , Rickshaw = require('rickshaw')
  , h = require('virtual-dom/h')
  , main = require('main-loop')
  , loop = main({ spectrum: [] }, render, require('virtual-dom'))

document.querySelector('#content').appendChild(loop.target)

var raws = Kefir.sequentially(2, _.flatten(raws))

function freqs (phasors) {
  return _.zipWith(
    fftUtil.fftFreq(phasors, 512)
    , fftUtil.fftMag(phasors)
    , function (x, y) {
      return {x: x, y: y}
  })
}

function render (state) {

  function point (d) {
    return h('div.point', { style: {
      'height':d.y/65+'px' 
      , 'width': '1px' 
      , 'float': 'left'
      , 'padding':'1px' 
      , 'background-color': '#3ee'
     }
   })
  }

  return h('div', [
    _.map(state.spectrum, point)
  ])
}


var ffts = raws.slidingWindow(512,512).map(fft).map(freqs)

ffts.onValue(function (spectrum) {
  loop.update({spectrum:spectrum})
})
