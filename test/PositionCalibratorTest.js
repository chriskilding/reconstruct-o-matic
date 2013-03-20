QUnit.module("PositionCalibrator");

test("first test within module", 1, function (assert) {
    ok(true, "a dummy");
});

test("pythagorasHyp - works with 3-4-5 rule", function (assert) {
  var result = PositionCalibrator.pythagorasHypotenuse(3, 4);
  equal(result, 5, true);
});

test("pythagorasHyp - doesn't crash with negative numbers", function (assert) {
  var result = PositionCalibrator.pythagorasHypotenuse(-3, -4);
  equal(result, 5, true);
});

test("pythagorasAdj - works with 3-4-5 rule", function (assert) {
  var result = PositionCalibrator.pythagorasAdjacent(4, 5);
  equal(result, 3, true);
});

test("pythagorasAdj - doesn't crash with negative numbers", function (assert) {
  var result = PositionCalibrator.pythagorasAdjacent(-4, -5);
  equal(result, 3, true);
});

test("distanceBetweenSensors - works with 3-4-5 rule", function (assert) {
  var referencePosition = [3, 3, 3];
  var otherPosition = [4, 4, 4];
  var result = PositionCalibrator.distanceBetweenSensors(referencePosition, otherPosition);
  deepEqual(result, [5, 5, 5], true);
});