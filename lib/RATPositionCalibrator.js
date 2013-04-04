// This position calibrator works if you're only dealing with Right Angled Triangles...
var Triangles = require("./Triangles");

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
  return hypotenuse.map(function(hyp, index, array) {
    return Triangles.pythagorasAdjacent(otherPosition[index], hyp);
  });
}

// Each position value should be an array of [x, y, z]
// and should be of a point on a common object (the user) they can both see
function distanceBetweenSensors(referencePosition, otherPosition) {  
  // hypotenuse = the distance between primary and other sensor
  // What's the difference?
  return referencePosition.map(function(refPos, index, array) {
    return Triangles.pythagorasHypotenuse(refPos, otherPosition[index]);
  });
}

exports.calibratePosition = calibratePosition;
exports.distanceBetweenSensors = distanceBetweenSensors;
exports.convertPositionValue = convertPositionValue;
