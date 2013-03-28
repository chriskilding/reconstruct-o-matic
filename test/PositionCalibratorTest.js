QUnit.module("PositionCalibrator");


test("prepVector - basic test", function (assert) {
  var input = [1, 1, 1];

  var actual = PositionCalibrator.prepVector(input);
  deepEqual(actual.elements, [-1, -1, -1], true);
});

test("distanceBetweenSensors - works with 3-4-5 rule", function (assert) {
  var referencePosition = [3, 3, 3];
  var otherPosition = [4, 4, 4];
  var result = PositionCalibrator.distanceBetweenSensors(referencePosition, otherPosition);
  deepEqual(result, [5, 5, 5], true);
});

test("distanceBetweenSensors - doesn't crash with negative numbers", function (assert) {
  var referencePosition = [-3, -3, -3];
  var otherPosition = [-4, -4, -4];
  var result = PositionCalibrator.distanceBetweenSensors(referencePosition, otherPosition);
  deepEqual(result, [5, 5, 5], true);
});