to run it use 
`python -m SimpleHTTPServer`
and then go to http://localhost:8000

you need to muck around in the visualizer-sample.js file to change what is being played. right now it is loading GSR data and then lying about the sample rate so that the web audio api can handle it and then plotting the FFT. the problem with the web audio api is that it only wants really high sample rates, like a lot higher than the sample rates usually used for EEG or GSR. but it's a nice way to play around with DSP on audio examples and visualize what's happening. oh well.

