// This position calibrator works if you're only dealing with Right Angled Triangles...

// Returns a callback func
// that should be applied on all data from
// the 'other' sensor in future
// to normalize that data
function calibratePosition(refPosition, otherPosition) {
  // User-level overall position is only reported
  // if the middleware believes it is valid
  // (beware of nulls!)
  var hyp = distanceBetweenSensors(refPosition, otherPosition);
  
  return function(otherPos) {
    return convertPositionValue(hyp, otherPos);
  };
}

// hypotenuse = the distance between primary and other sensor
// otherDistance = dist of recorded point on user from the other sensor
// so now we just compute the third side 
// Each position value should be an array of [x, y, z]
function convertPositionValue(hypotenuse, otherPosition) {  
  // What's the difference?
  return [
    pythagorasAdj(otherPosition[0], hypotenuse[0]),
    pythagorasAdj(otherPosition[1], hypotenuse[1]),
    pythagorasAdj(otherPosition[2], hypotenuse[2])
  ];
}

// Each position value should be an array of [x, y, z]
// and should be of a point on a common object (the user) they can both see
function distanceBetweenSensors(referencePosition, otherPosition) {  
  // hypotenuse = the distance between primary and other sensor
  // What's the difference?
  return [
    pythagorasHyp(referencePosition[0], otherPosition[0]),
    pythagorasHyp(referencePosition[1], otherPosition[1]),
    pythagorasHyp(referencePosition[2], otherPosition[2])
  ];
}


// If sensor 1 and sensor 2 both have measured distances 
// to the user
// then the distance between the two sensors
// is just the third side in a triangle.
function pythagorasHyp(a, b) {
  return Math.sqrt(a * a + b * b);
}

function pythagorasAdj(a, c) {
  // If the result is negative
  // Math.sqrt returns NaN
  // so don't use the naive version Math.sqrt(c * c - a * a);
  // need to take abs value first
  return Math.sqrt(Math.abs(c * c - a * a));
}

exports.calibratePosition = calibratePosition;
exports.pythagorasAdjacent = pythagorasAdj;
exports.pythagorasHypotenuse = pythagorasHyp;
exports.distanceBetweenSensors = distanceBetweenSensors;
exports.convertPositionValue = convertPositionValue;
