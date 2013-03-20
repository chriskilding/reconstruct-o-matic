QUnit.module("RotationCalibrator");

test("diffBetweenComponents - identical values = no change", function (assert) {
  var refComponent = 0.5;
  var otherComponent = 0.5;
  
  var result = RotationCalibrator.differenceBetweenComponents(refComponent, otherComponent);
  
  equal(result, 0, true);
});

