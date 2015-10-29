var h = require('hyperscript')

function spectrogram (list) {

  var d = h('h1',{ style: {
    'overflow': 'hidden'
   }
  }, list[0])
    
  return d.outerHTML

}


module.exports = spectrogram
