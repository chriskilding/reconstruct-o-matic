QUnit.module("PositionCalibrator");

test("first test within module", 1, function (assert) {
    ok(true, "a dummy");
});

test("pythagorasHyp - works with the 3-4-5 rule", function (assert) {
  var result = PositionCalibrator.pythagorasHypotenuse(3, 4);
  equal(result, 5, true);
});

test("pythagorasAdj - works with the 3-4-5 rule", function (assert) {
  var result = PositionCalibrator.pythagorasAdjacent(4, 5);
  equal(result, 3, true);
});