var shoe = require('shoe')
  , Kefir = require('kefir')
  , main = require('main-loop')
  , channelName =  '/spectra'

// this wraps the main client app (app/index.js)
// this app has 2 main responsibilities:
//
//   * setting up the stream from EEG device
//   * making a function that lets the app draw on the DOM
//
// so, the client app (app/index.js) exposes a function:
//
//   module.exports = function (stream, draw) {
//     // ...
//   }
//
// `stream` is a Kefir stream,
// `draw` is a function (more on this later)
//
// first, `stream`:
// `stream` is a synchronous, discrete channel of data
// that comes from our websocket (shoe) stream
//
// the shoe stream is a node stream
// the underlying structure of the stream is a JSON list
// 
//   [ {...} ...]
//

var stream = Kefir.stream(function (emitter) {

  var parser  = require('JSONStream').parse('*')

  var mapSync = require('event-stream').mapSync
  
  shoe(channelName).pipe(parser).pipe(mapSync(emitter.emit))

  return

})

// (here, for us, "synchronous" means that 
// the data that comes over `stream` will be well-ordered).
//
// so that's `stream.`

// now, `draw` is a higher-order function that takes 
//
//   * a Kefir `stream`,
//   * `fn`, which takes a list and returns HTML
//   * `description`, a string that will show up in the UI
//
// we can use `draw` to add a view for a stream we're processing
// and see the data come through in real-time
//
// ex. usage in your app:
//  
//     draw(alphaBetaRatio, Spectrogram, 'power spectrum')
//

function draw (stream, fn, description) {

  // we make a div that looks like
  //
  //     <div>
  //       my description
  //     </div>

  var parent = document.createElement('div')
  var desc   = document.createTextNode(description)
  parent.appendChild(desc)

  // and add this div to the dom
  
  document.body.appendChild(parent)

  // now we set up main-loop
  // to do virtual-dom diffing on an element inside this div.
  
  var loop = main([], fn, require('virtual-dom'))
  parent.appendChild(loop.target)
  
  // finally, we set-up side effect:
  // every value that comes over `stream`
  //
  // will be passed to `fn`, 
  // the result will be used to update `looop`

  stream.onValue(loop.update)

  return
}

// we require the app
// and launch it
//
// TODO docReady(setup)

var app = require('./app/index.js')
app(stream, draw)
