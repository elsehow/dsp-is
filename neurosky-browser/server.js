var http = require('http')
  , shoe = require('shoe')
  , spawn = require('child_process').spawn
  , es = require('event-stream')
  , mindwaveClientPath = __dirname + '/lib/mindwave-client.js'
  , debugMindwaveClientPath = __dirname + '/lib/fake-mindwave-client.js'
  , ecstatic = require('ecstatic')(__dirname + '/public')
  , server = http.createServer(ecstatic)
  , argv = process.argv.slice(2)
  , debug = argv[0] === 'debug'

console.log('debug?', debug)

server.listen(8000)

// first, we spawn a process
// this process spits data out over process.stdout
//
// this server does nothing but hook that stream up
// to a websocket connection

if (debug) 
  var c = spawn('node', [debugMindwaveClientPath])
else 
  var c = spawn('node', [mindwaveClientPath])

// on the client side,
// we parse each object in the list with 
//
//   JSONStream.parse('*')
//
// we could easily multiplex this stream by setting the server
// to send sending objects with keys
// 
// so, on the server side, we would do:
//
//   JSONStream.stringifyObject()
//
// and on the client side:
//   
//   JSONStream.parse('fft')
//   JSONStream.parse('signalQuality')
//
// etc...

var sock = shoe(function (stream) {
  c.stdout.pipe(stream)
})

sock.install(server, '/spectra')
