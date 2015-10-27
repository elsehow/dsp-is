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

if (debug) 
  var c = spawn('node', [debugMindwaveClientPath])
else 
  var c = spawn('node', [mindwaveClientPath])

var sock = shoe(function (stream) {
  c.stdout.pipe(stream)
})

sock.install(server, '/raws')
