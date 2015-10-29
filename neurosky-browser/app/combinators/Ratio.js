// combines two streams
// finds the ratio between the first element of their values
//
//    in:   [1],[4]
//    out:  [.25]
//
//    in:   [1,2],[4,7]
//    out:  [.25]
//
//
function r (l1, l2) {
  return [l1[0] / l2[0]]
}

module.exports = r
