QUnit.module("PositionCalibrator");

test("prepVector - basic test", function (assert) {
  var input = [1, 1, 1];

  var actual = PositionCalibrator.prepVector(input);
  deepEqual(actual, [-1, -1, -1], true);
});

test("deltaBetweenSensors - if sensors were next to each other", function (assert) {
  var referencePosition = [3, 3, 3];
  var otherPosition = [4, 4, 4];
  var result = PositionCalibrator.deltaBetweenSensors(referencePosition, otherPosition);
  // Readings from 'other' would need to be moved 'down' by 1, 'left' by 1 etc.
  deepEqual(result, [-1, -1, -1], true);
});

test("deltaBetweenSensors - negative number scenario", function (assert) {
  var referencePosition = [-3, -3, -3];
  var otherPosition = [-4, -4, -4];
  var result = PositionCalibrator.deltaBetweenSensors(referencePosition, otherPosition);
  // Readings from 'other' would need to be moved 'up' by 1, 'right' by 1 etc.
  deepEqual(result, [1, 1, 1], true);
});

test("convertRealVector - basic scenario", function (assert) {
  var otherPosition = [4, 4, 4];
  var delta = [-1, -1, -1];

  var result = PositionCalibrator.convertRealVector(otherPosition, delta);
  // Just like it came from the primary sensor
  deepEqual(result, [3, 3, 3], true);
});

// FIXME this should be an integration test
// as it requires syncing of coordinate systems
// which in turn requires the RotationCalibrator
test("calibratePosition - basic scenario", function (assert) {
  // With joint in sight of both sensors the values are
  var ref = [3, 3, 3];
  var other = [15, 15, 15];
  // and thus
  var delta = [-12, -12, -12];
  
  var func = PositionCalibrator.calibratePosition(ref, other);

  // With hand moved behind so ref can't see it
  // we pretend the values from the other sensor's perspective are:
  // a bit to the left
  // same height
  // a bit towards the sensor
  var otherReal = [13, 15, 13];
  
  var actual = func(otherReal);

  // Just like it came from the primary sensor
  deepEqual(actual, [5, 3, 5], true);

 /* var otherPosition = [4, 4, 4];
  var delta = [-1, -1, -1];

  var result = PositionCalibrator.convertRealVector(otherPosition, delta);
  */
});


test("convertRealVector - floating point", function (assert) {
  var otherPosition = [3.5, 3.5, 3.5];
  var delta = [-0.5, -0.5, -0.5];

  var result = PositionCalibrator.convertRealVector(otherPosition, delta);
  // Just like it came from the primary sensor
  deepEqual(result, [3, 3, 3], true);
});