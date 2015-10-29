var average = require('average')
  , stdev   = require('compute-stdev')

// takes a list of a single value
// and a list of values
//
// returns:
// [1] for true 
// [0] for false
//
//   in:  [5], [5, 6, 1, 3, 6, 9, 9]
//   out: [0]
//
// returns true if the first element of the first list
// is more than `std` standard deviations above the mean of values in the second list

module.exports = function (std) {
  return function (l1, l2) {
    function threshold (mean, deviance ) {
      return mean + std*deviance
    }
    function trueFalse (predicate) {
      if (predicate) 
        return [1]
      return [0]
    }
    var v    = l1[0]
    var mean = average(l2)
    var dev  = stdev(l2)
    if (std > 0)
      return trueFalse((v > threshold(mean, dev)))
    if (std < 0)
      return trueFalse((v < threshold(mean, dev)))
  }
}
