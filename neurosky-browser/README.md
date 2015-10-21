# neurosky-browser

lets bandpass an EEG in the browser

## installation

`npm install`

then

`npm run build`

and finally, turn on your neurosky device, and

`npm start`

## explanation

see a real-time FFT of your neurosky data..........in the web browser!!

lib/mindwave-client.js is reading neurosky data over the serial port using the [mindwave2](http://npmjs.com/package/mindwave2) package on npm. it produces spectral data at 100Mhz, which it writes to process.stdout

server.js pipes mindwave-client.j's process.stdout to a [shoe](http://npmjs.com/package/shoe) stream.

the web client (client.js) bandpasses this stream into alpha, beta, gamma, + delta bands


