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
  return newMatrix.map(function (newVal, index, array) {
    return convertRealComponent(newVal, deltaMatrix[index]);
  });
}

// Underlying function used by convertRealMatrix
// which operates on just one component of the new matrix at a time
function convertRealComponent(newRotationComponent, deltaComponent) {
  // Off we go
  return newRotationComponent - deltaComponent;
}

// Rotation normalization per joint
// When calibrating a secondary sensor
// this produces a (normally 3x3) matrix of deltas
// between the reference rotation matrix values
// and the otherMatrix values
function rotationDeltaMatrix(referenceMatrix, otherMatrix) {  
  return referenceMatrix.map(function (refVal, index, array) {
    return differenceBetweenComponents(refVal, otherMatrix[index]);
  });
}

// In general, the component Rij of a rotation matrix
// equals the cosine of the angle between the ith axis of the original coordinate system
// and the jth axis of the rotated coordinate system.
// (From http://www.mathpages.com/home/kmath593/kmath593.htm)
function differenceBetweenComponents(refComponent, otherComponent) {  
  return refComponent - otherComponent;
}

// The main function of interest
exports.calibrateRotation = calibrateRotation;
// Supporting functions
exports.convertRealMatrix = convertRealMatrix;
exports.convertRealComponent = convertRealComponent;
exports.rotationDeltaMatrix = rotationDeltaMatrix;
exports.differenceBetweenComponents = differenceBetweenComponents;