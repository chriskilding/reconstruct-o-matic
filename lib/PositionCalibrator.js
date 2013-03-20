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
  var distance = [];
  
  for (var i = 0; i < hypotenuse.length; i++) {
    distance.push(pythagorasAdj(hypotenuse[i], otherPosition[i]));
  }
  
  // What's the difference?
  return distance;
}

// Each position value should be an array of [x, y, z]
// and should be of a point on a common object (the user) they can both see
function distanceBetweenSensors(referencePosition, otherPosition) {
  var distance = [];
  
  for (var i = 0; i < referencePosition.length; i++) {
    distance.push(pythagorasHyp(referencePosition[i], otherPosition[i]));
  }
  
  // What's the difference?
  return distance;
}


// If sensor 1 and sensor 2 both have measured distances 
// to the user
// then the distance between the two sensors
// is just the third side in a triangle.
function pythagorasHyp(a, b) {
  return Math.sqrt(a * a + b * b);
}

function pythagorasAdj(a, c) {
  return Math.sqrt(c * c - a * a);
}

exports.calibratePosition = calibratePosition;
exports.pythagorasAdjacent = pythagorasAdj;
exports.pythagorasHypotenuse = pythagorasHyp;
exports.distanceBetweenSensors = distanceBetweenSensors;
exports.convertPositionValue = convertPositionValue;
