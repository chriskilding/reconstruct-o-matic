var sylvester = require('sylvester');
var Vector = sylvester.Vector; 
var Matrix = sylvester.Matrix; 

function calibrateRotation(refRotation, otherRotation) {
  

}

// TODO implement rotation normalization if needed
// Per joint
/*function jointRotationDelta(referenceJoint, otherJoint) {
  // Rotation matrix of the reference
  var refMatrix = Matrix.create(referenceJoint.position);
  
  // Rotation matrix of the secondary
  var otherMatrix = Matrix.create(otherJoint.position);
  

}*/

exports.calibrateRotation = calibrateRotation;