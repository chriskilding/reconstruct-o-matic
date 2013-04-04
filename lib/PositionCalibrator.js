// Remember, position data alone only indicates a scalar:
// of how far a joint is from a sensor
// it doesn't know where the sensor is around the user
// or in relation to other sensors.
//
// For that reason YOU MUST PREPROCESS YOUR DATA
// by rotating the data from each sensor
// so it is expressed in terms of the primary sensor
// THEN, assuming your sensors all measure distance in the same units,
// the PositionCalibrator will be able to reconstruct position.


// Returns a translation matrix
// that you will apply to all 'real' data you receive
// to adjust a position vector from a secondary sensor
// so it applies to the coordinate system of the reference sensor
function calibratePosition(referencePosition, otherPosition) {
  var jointDelta = deltaBetweenSensors(referencePosition, otherPosition);
  
  return function(newPosition) {
    return convertRealVector(newPosition, jointDelta);
  };
}

// After calibration has happened and we got some 'real' position data
// transform it to be in terms of the reference sensor's coord system
// Assumes the vectors have already been 'prepared'
function convertRealVector(newPosition, deltaPosition) {
  return newPosition.map(function(newPos, index) {
    return convertRealComponent(newPos, deltaPosition[index]);
  });  
}

// Just one element
function convertRealComponent(newPos, deltaPos) {
  return newPos + deltaPos;
}

// If start with a ref position [3, 3, 3] and other position [4, 4, 4]
// those are the distances of the joint from each Kinect
// now reverse the vectors so we have the joint at centre of coord system
// making the Kinects located at [-3, -3, -3] and [-4, -4, -4]
// the distance between each of those will yield the dist between sensors
//
// Each position value should be an array of [x, y, z]
// and should be of a point on a common object (the user) they can both see
function deltaBetweenSensors(referencePosition, otherPosition) {  
  // What's the difference?
  return referencePosition.map(function(a, index, array) {
    return a - otherPosition[index];
  });  
}

// Turns an incoming JS array into right format, and reverses it
function prepVector(arr) {
  return arr.map(prepElement);
}

// Just one element of an array
function prepElement(value) {
  return value * -1;
}

exports.deltaBetweenSensors = deltaBetweenSensors;
exports.prepVector = prepVector;
exports.calibratePosition = calibratePosition;
exports.convertRealVector = convertRealVector;