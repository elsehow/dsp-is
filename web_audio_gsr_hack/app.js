window.onload = function() {
    var sample = new VisualizerSample();
    document.querySelector('button#play').addEventListener('click', function() {
        sample.togglePlayback()
    });

    var channels = 1;
    //var frameCount = context.sampleRate * 2.0;
    //var buffer = context.createBuffer(channels, frameCount, context.sampleRate);
    var my_frame_rate = 3000;
    var frameCount = my_frame_rate * 2.0;
    var buffer = context.createBuffer(channels, frameCount, my_frame_rate);
    document.querySelector('button#test').addEventListener('click', function() {
        console.log('button#test click');
        for (var channel = 0; channel < channels; channel++) {
            var nowBuffering = buffer.getChannelData(channel);
            for (var i = 0; i < frameCount; i++) {
                nowBuffering[i] = Math.random() * 2 - 1;
            }
        }
        var source = context.createBufferSource();
        source.buffer = buffer;
        source.connect(context.destination);
        source.start();
    });

};
