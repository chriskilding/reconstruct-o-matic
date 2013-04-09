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
var Vector3 = require('./Vector3');
// Can _.wrap if you want to deal with that pesky Math.cos
var _ = require("underscore");

// 3x3 zeroes matrix
const zeroes = [0, 0, 0, 0, 0, 0, 0, 0, 0];

// Calibrate the system
// figure out the orientations of the sensor on each client
// relative to the authoritative client
// and return a transform matrix for each secondary sensor
function calibrate(refSkeleton, otherSkeleton) {
  // Note that the rotation is not properly tracked for all joints:
  // some always have a rotation matrix of [0, 0... 0]
  // so to get past this
  // we need to get the transformations from every joint with valid data
  // average them in some way
  // then apply this one transformation to every joint
  
  
  return function(receivedData) {
    return posCorrectorFunc(receivedData);
  };
}

// Does the sanity checking around computeJointDelta
function calibrateJoint(refJoint, otherJoint) {
  const isRefZero = _.isEqual(refJoint.rotation, zeroes);
  const isOtherZero = _.isEqual(otherJoint.rotation, zeroes);

  // If both joints have all-zero rotation matrices
  // they should be ignored
  if (isRefZero && isOtherZero) {
    return null;
  }
  else {
    return computeJointDelta(refJoint, otherJoint);
  }
}

// A joint contains
// id, position, position confidence, rotation, rotation confidence
// this function assumes the rotation matrix it gets for a joint is valid
// so it's your responsibility to ensure this if you call it
function computeJointDelta(refJoint, otherJoint) {
  // Get the rotation delta first
  const deltaQuat = RotationCalibrator.rotationDelta(refJoint.rotation, otherJoint.rotation);
  
  // Align the coord systems of both sensors by rotating the raw position value  
  // Now work out the position in this rotated coord system
  const rotatedPosition = Vector3.applyQuaternion(Vector3.vectorAsObject(otherJoint.position), deltaQuat);
  
  // So with coord systems of both sensors aligned,
  // the 'other' sensor / joint is now
  // [m, n, o] away from the reference reading
  // find this distance
  const positionDelta = PositionCalibrator.deltaBetweenSensors(refJoint.position, rotatedPosition);
  
  // Return a tuple of position and rotation deltas
  return {
    positionDeltaVector: positionDelta,
    rotationDeltaQuaternion: deltaQuat
  };
}

exports.calibrate = calibrate;
exports.calibrateJoint = calibrateJoint;
exports.computeJointDelta = computeJointDelta;