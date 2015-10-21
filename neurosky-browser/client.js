var shoe = require('shoe')
  , parser = require('JSONStream').parse('fft')
  , es = require('event-stream')
  , h = require('virtual-dom/h')
  , main = require('main-loop')
  , loop = main({ spectrum: []}, render, require('virtual-dom'))
  , esmap = function (fn) { return es.mapSync(fn) }

function bands () {
	  return [
      {
    		name: 'delta'
  		, min: 0
  		, max: 4
    	}
      , {
    		name: 'theta'
  		, min: 4
  		, max: 7
    	}
      , {
    		name: 'alpha'
   		, min: 8
   		, max: 15
    	}
      , {
    		name: 'beta'
   		, min: 16
   		, max: 31 
    	}
      , {
    		name: '"gamma"'
   		, min: 32 
   		, max: 256
    	}
    ]
	}

function bandpass (spectrum, band) {
	return require('lodash').slice(spectrum, band.min, band.max)
}

function render (state) {

  function drawMagnitude (mag) {
    return h('div.point', { style: {
      'height': mag/65+'px' 
    , 'width': '1px' 
    , 'float': 'left'
    , 'padding':'1px' 
    , 'background-color': '#3ee'
     }
   })
  }

	function graph (freqs, bandName) {
		return h('div.band', { style:
			{
				cssFloat:'left'
			, paddingRight:'5px'
			}
		}
		, [
			h('h3', bandName)
		, h('div', freqs.map(drawMagnitude))
		, h('br')
		])
	}

	function bandpassGraphs (spectrum) {
		return h('div.bandpassGraphs', 
		  bands().map(function (band) {
		  	var b = bandpass(state.spectrum, band)
		  	return graph(b, band.name)
		  })
    )
	}

	return bandpassGraphs(state.spectrum)
}

function drawSpectrum (s) {
  loop.update({spectrum: s})
}

document.querySelector('#content').appendChild(loop.target)
var stream = shoe('/raws').pipe(parser).pipe(esmap(drawSpectrum))
