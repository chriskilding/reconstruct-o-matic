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

exports.calibrateRotation = calibrateRotation;