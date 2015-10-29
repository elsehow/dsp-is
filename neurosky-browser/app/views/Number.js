var h = require('hyperscript')

function spectrogram (list) {

  var d = h('h1',{ style: {
    'overflow': 'hidden'
    , 'padding-bottom': '10px'
   }
  }, list[0])
    
  return d.outerHTML

}


module.exports = spectrogram
