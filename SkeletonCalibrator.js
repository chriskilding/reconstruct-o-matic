// Note: this is all currently highly speculative.
//
// The reference coordinate system is that used by the authoritative client / sensor
// so when we get a skeleton from another secondary sensor
// we need to rotate it and translate it
// so the secondary skeleton's coordinates are "as if viewed by the primary sensor".
//
// To do this, a calibration step is needed:
// the user must first stand in a place where both (all) sensors can see them.
// So our calculations are not based on sensors looking for *each other*
// but on their views of one common object located between them (the user).
//
// Then we work out the difference in distance from primary and other sensor
// this tells us how far 'off' the other sensor is
// i.e. how much skeleton coordinates from that sensor need to be translated by.
// And we work out this difference for each secondary sensor used.

var sylvester = require('sylvester');
var Vector = sylvester.Vector; 
var Matrix = sylvester.Matrix; 

// Calibrate the system
// figure out the orientations of the sensor on each client
// relative to the authoritative client
function calibrate(skeletons) {
  var refSkel = skeletons[0];

  for (var i = 0; i < skeletons.length; i++) {    
      skeletons[i].positionConfidence;
      skeletons[i].position;
    
    
      skeletons[i].rotationConfidence;
      skeletons[i].rotation;
    
  }
}

function distanceDelta(referenceUser, otherUser) {
  // Distance from the reference sensor
  var refVector = Vector.create(referenceUser.position);
  
  // Distance from the secondary sensor
  var otherVector = Vector.create(otherUser.position);
  
  // What's the difference?
  return refVector.distanceFrom(otherVector);
}




// TODO implement rotation normalization if needed
// Per joint
function jointRotationDelta(referenceJoint, otherJoint) {
  // Rotation matrix of the reference
  var refMatrix = Matrix.create(referenceJoint.position);
  
  // Rotation matrix of the secondary
  var otherMatrix = Matrix.create(otherJoint.position);
  

}

exports.calibrate = calibrate;