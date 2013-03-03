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

var posCalibrator = require('./PositionCalibrator');
var rotCalibrator = require('./RotationCalibrator');

// Calibrate the system
// figure out the orientations of the sensor on each client
// relative to the authoritative client
// and return a transform matrix for each secondary sensor
function calibrate(refUser, otherUser) {
  var posCorrectorFunc = posCalibrator.calibratePosition(refUser.position, otherUser.position);
  
  var rotCorrectorFunc = rotCalibrator.calibrateRotation(refUser.skeleton, otherUser.skeleton);
  
  return function(receivedData) {
    return posCorrectorFunc(receivedData);
  };
}


exports.calibrate = calibrate;