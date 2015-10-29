var h = require('hyperscript')
  , _ = require('lodash')
  , LinScale = require('simple-linear-scale')

function spectrogram (list) {

  var divHeight = 100

  var maxValue = _.max(list)

  var normalize = LinScale([0, maxValue], [0, divHeight])

  function drawMagnitude (mag) {
    return h('div.point', { style: {
        'height': normalize(mag) + 'px'
      , 'width': '1px' 
      , 'float': 'left'
      , 'padding':'1px' 
      , 'background-color': '#3ee'
      }
     })
    }
 
  var d = h('div',{ style: {
    'overflow': 'hidden'
   }
  }, _.map(list, drawMagnitude))
    
  return d.outerHTML

}


module.exports = spectrogram
