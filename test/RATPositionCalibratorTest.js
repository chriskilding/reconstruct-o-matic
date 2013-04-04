QUnit.module("RATPositionCalibrator");

test("distanceBetweenSensors - works with 3-4-5 rule", function (assert) {
  var referencePosition = [3, 3, 3];
  var otherPosition = [4, 4, 4];
  var result = RATPositionCalibrator.distanceBetweenSensors(referencePosition, otherPosition);
  deepEqual(result, [5, 5, 5], true);
});

test("distanceBetweenSensors - doesn't crash with negative numbers", function (assert) {
  var referencePosition = [-3, -3, -3];
  var otherPosition = [-4, -4, -4];
  var result = RATPositionCalibrator.distanceBetweenSensors(referencePosition, otherPosition);
  deepEqual(result, [5, 5, 5], true);
});

test("convertPositionValue - works with 3-4-5 rule", function (assert) {
  var hypotenuse = [5, 5, 5];
  var otherPosition = [4, 4, 4];
  var result = RATPositionCalibrator.convertPositionValue(hypotenuse, otherPosition);
  deepEqual(result, [3, 3, 3], true);
});

test("convertPositionValue - hyp smaller than opp or adj doesn't yield NaNs", function (assert) {
  var hypotenuse = [4, 4, 4];
  var otherPosition = [5, 5, 5];
  var result = RATPositionCalibrator.convertPositionValue(hypotenuse, otherPosition);
  deepEqual(result, [3, 3, 3], true);
});