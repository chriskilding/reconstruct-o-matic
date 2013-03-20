// Returns a function that you will apply to all 'real' data you receive
// to express a rotation matrix from a secondary sensor
// in terms of the coordinate system of the reference sensor
function calibrateRotation(refRotation, otherRotation) {
  
  var jointDelta = rotationDeltaMatrix(refRotation, otherRotation);
  
  return function(newRotMatrix) {
    return convertRealMatrix(newRotMatrix, jointDelta);
  };
}

// After calibration has happened and we got some 'real' rotation data
// transform it to be in terms of the reference sensor's coord system
function convertRealMatrix(newMatrix, deltaMatrix) {
  var outputMatrix = [];
  
  for (var i = 0; i < newMatrix.length; i++) {
    outputMatrix.push(convertRealComponent(newMatrix[i], deltaMatrix[i]));
  }
  
  return outputMatrix;
}

// Underlying function used by convertRealMatrix
// which operates on just one component of the new matrix at a time
function convertRealComponent(newRotationComponent, deltaComponent) {
  // First undo the cosine
  var rawAngle = Math.acos(newRotationComponent);  
  // Convert the angle
  var converted = rawAngle - deltaComponent;
  // Then redo the cosine
  var finalVal = Math.cos(converted);
  
  console.log('rawangle', rawAngle, 'converted', converted, 'final', finalVal);
  
  // Off we go
  return finalVal;
}

// Rotation normalization per joint
// When calibrating a secondary sensor
// this produces a (normally 3x3) matrix of deltas
// between the reference rotation matrix values
// and the otherMatrix values
function rotationDeltaMatrix(referenceMatrix, otherMatrix) {
  var outputMatrix = [];
  
  for (var i = 0; i < referenceMatrix.length; i++) {
    var delta = differenceBetweenComponents(referenceMatrix[i], otherMatrix[i]);
    outputMatrix.push(delta);
  }
  
  return outputMatrix;
}


// In general, the component Rij of a rotation matrix
// equals the cosine of the angle between the ith axis of the original coordinate system
// and the jth axis of the rotated coordinate system.
// (From http://www.mathpages.com/home/kmath593/kmath593.htm)
function differenceBetweenComponents(refComponent, otherComponent) {
  // First undo the cosine with arccos
  var refAngle = Math.acos(refComponent);
  var otherAngle = Math.acos(otherComponent);
  
  // The difference of the two should just be
  // one minus the other
  // (no need to take the absolute value)
  var delta = refAngle - otherAngle;
  
  return delta;
}

// The main function of interest
exports.calibrateRotation = calibrateRotation;
// Supporting functions
exports.convertRealMatrix = convertRealMatrix;
exports.convertRealComponent = convertRealComponent;
exports.rotationDeltaMatrix = rotationDeltaMatrix;
exports.differenceBetweenComponents = differenceBetweenComponents;