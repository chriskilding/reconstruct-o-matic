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

var PositionCalibrator = require('./PositionCalibrator');
var RotationCalibrator = require('./RotationCalibrator');
// Can _.wrap if you want to deal with that pesky Math.cos
var _ = require("underscore");

// Calibrate the system
// figure out the orientations of the sensor on each client
// relative to the authoritative client
// and return a transform matrix for each secondary sensor
function calibrate(refSkeleton, otherSkeleton) {
  var posCorrectorFunc = posCalibrator.calibratePosition(refUser.position, otherUser.position);
  
  var rotCorrectorFunc = rotCalibrator.calibrateRotation(refUser.skeleton, otherUser.skeleton);
  
  return function(receivedData) {
    return posCorrectorFunc(receivedData);
  };
}

// A joint contains
// id, position, position confidence, rotation, rotation confidence
function calibrateJoint(refJoint, otherJoint) {
  // Rotation first
  var rotFunc = RotationCalibrator.calibrateRotation(refJoint.rotation, otherJoint.rotation);
  
  // So with coord systems of both sensors aligned,
  // the 'other' sensor / joint is now
  // [m, n, o] away from the reference reading
  
  var posFunc = PositionCalibrator.calibratePosition(refJoint.position, otherJoint.position);
}

exports.calibrate = calibrate;
exports.calibrateJoint = calibrateJoint;