var JSONStream = require('JSONStream')
  // debug
  , raw512 = require('lodash').flatten(require('./sampleRawData.js'))
  // EEG processing stuff
  , fftjs = require('fft-js')
  , fft = fftjs.fft
  , freq = function (d) { return fftjs.util.fftFreq(d,512) }
  , magnitudes = function (raws) { return fftjs.util.fftMag(fft(raws)) }

var stringifier = JSONStream.stringify()
function writeFFT (d) {
  stringifier.write(d)
}

// process raw mindwave data
var raws = require('kefir').sequentially(2, raw512)
raws
  .slidingWindow(512,512)
  .throttle(10)
  .map(magnitudes)
  .onValue(writeFFT)

stringifier.pipe(process.stdout)
