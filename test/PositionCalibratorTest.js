QUnit.module("PositionCalibrator");


test("prepVector - basic test", function (assert) {
  var input = [1, 1, 1];

  var actual = PositionCalibrator.prepVector(input);
  deepEqual(actual.elements, [-1, -1, -1], true);
});

test("deltaBetweenSensors - if sensors were next to each other", function (assert) {
  var referencePosition = [3, 3, 3];
  var otherPosition = [4, 4, 4];
  var result = PositionCalibrator.deltaBetweenSensors(referencePosition, otherPosition);
  // Readings from 'other' would need to be moved 'down' by 1, 'left' by 1 etc.
  deepEqual(result, [-1, -1, -1], true);
});

test("deltaBetweenSensors - doesn't crash with negative numbers", function (assert) {
  var referencePosition = [-3, -3, -3];
  var otherPosition = [-4, -4, -4];
  var result = PositionCalibrator.deltaBetweenSensors(referencePosition, otherPosition);
  // Readings from 'other' would need to be moved 'up' by 1, 'right' by 1 etc.
  deepEqual(result, [1, 1, 1], true);
});