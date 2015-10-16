/*
 * Copyright 2013 Boris Smus. All Rights Reserved.

 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var WIDTH = 640;
var HEIGHT = 360;

// Interesting parameters to tweak!
var SMOOTHING = 0.8;
var FFT_SIZE = 2048;

function VisualizerSample() {
  this.analyser = context.createAnalyser();

  this.analyser.connect(context.destination);
  this.analyser.minDecibels = -140;
  this.analyser.maxDecibels = 0;
  loadSounds(this, {
    buffer: 'surf_city.mp3',
    salon: 'french_salon.wav',
  }, onLoaded);
  this.freqs = new Uint8Array(this.analyser.frequencyBinCount);
  this.times = new Uint8Array(this.analyser.frequencyBinCount);

  function onLoaded() {
    var button = document.querySelector('button');
    button.removeAttribute('disabled');
    button.innerHTML = 'Play/pause';
  };

  this.isPlaying = false;
  this.startTime = 0;
  this.startOffset = 0;

  var that = this;
    load_json_samples('gsr_data.json', {time: 'seconds', value: 'gsr'}).then(function(o) {
        that.gsr_buffer = context.createBuffer(1, o.normalized.length, 3000);
        var b = that.gsr_buffer.getChannelData(0);
        for (var i = 0; i < o.normalized.length; i++) {
            b[i] = o.normalized[i];
        }
    });
}

// Toggle playback
VisualizerSample.prototype.togglePlayback = function() {
  if (this.isPlaying) {
    // Stop playback
    this.source[this.source.stop ? 'stop': 'noteOff'](0);
    this.startOffset += context.currentTime - this.startTime;
    console.log('paused at', this.startOffset);
    // Save the position of the play head.
  } else {
    this.startTime = context.currentTime;
    console.log('started at', this.startOffset);
    /* using the mp3 we loaded already
    this.source = context.createBufferSource();
    this.source.buffer = this.buffer;
    */
    /* using a square wave
    this.source = context.createOscillator();
    this.source.type = 'square';
    this.source.frequency.value = 400;
    */
    /* using a sine wave
    this.source = context.createOscillator();
    this.source.type = 'sine';
    this.source.frequency.value = 400;
    */
    /* using some GSR data we loaded already */
    this.source = context.createBufferSource();
    this.source.buffer = this.gsr_buffer;
    /* using white noise
    this.source = get_white_noise_source(2, 3000*2, 3000); 
    */

    this.source.loop = true;
    // Connect graph
    this.source.connect(this.analyser);
    /* optionally pass things thru a convolver
    var convolver = context.createConvolver();
    convolver.buffer = this.salon;
    this.source.connect(convolver);
    convolver.connect(this.analyser);
    */
    
    // Start playback, but make sure we stay in bound of the buffer.
    this.source[this.source.start ? 'start' : 'noteOn'](0, this.startOffset % this.buffer.duration);
    // Start visualizer.
    requestAnimFrame(this.draw.bind(this));
  }
  this.isPlaying = !this.isPlaying;
}


VisualizerSample.prototype.draw = function() {
  this.analyser.smoothingTimeConstant = SMOOTHING;
  this.analyser.fftSize = FFT_SIZE;

  // Get the frequency data from the currently playing music
  this.analyser.getByteFrequencyData(this.freqs);
  this.analyser.getByteTimeDomainData(this.times);

  var width = Math.floor(1/this.freqs.length, 10);

  var canvas = document.querySelector('canvas');
  var drawContext = canvas.getContext('2d');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  // Draw the frequency domain chart.
  for (var i = 0; i < this.analyser.frequencyBinCount; i++) {
    var value = this.freqs[i];
    var percent = value / 256;
    var height = HEIGHT * percent;
    var offset = HEIGHT - height - 1;
    var barWidth = WIDTH/this.analyser.frequencyBinCount;
    var hue = i/this.analyser.frequencyBinCount * 360;
    drawContext.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
    drawContext.fillRect(i * barWidth, offset, barWidth, height);
  }

  // Draw the time domain chart.
  for (var i = 0; i < this.analyser.frequencyBinCount; i++) {
    var value = this.times[i];
    var percent = value / 256;
    var height = HEIGHT * percent;
    var offset = HEIGHT - height - 1;
    var barWidth = WIDTH/this.analyser.frequencyBinCount;
    drawContext.fillStyle = 'white';
    drawContext.fillRect(i * barWidth, offset, 1, 2);
  }

  if (this.isPlaying) {
    requestAnimFrame(this.draw.bind(this));
  }
}

VisualizerSample.prototype.getFrequencyValue = function(freq) {
  var nyquist = context.sampleRate/2;
  var index = Math.round(freq/nyquist * this.freqs.length);
  return this.freqs[index];
}
