QUnit.module("RotationCalibrator");

test("diffBetweenComponents - identical values = no change", function (assert) {
  var refComponent = 0.5;
  var otherComponent = 0.5;
  
  var result = RotationCalibrator.differenceBetweenComponents(refComponent, otherComponent);
  
  equal(result, 0, true);
});

test("diffBetweenComponents - negative values", function (assert) {
  var refComponent = -0.5;
  var otherComponent = -0.5;
  
  var result = RotationCalibrator.differenceBetweenComponents(refComponent, otherComponent);
  
  equal(result, 0, true);
});

test("rotationDeltaMatrix - identical values = no change", function (assert) {
  // a real Kinect data sample
  var refMatrix = [0.9178107380867004, -0.04468444734811783, -0.3944951295852661, 0.1306413114070892, 0.9723015427589417, 0.1938103586435318, 0.3749079704284668, -0.2294186502695084, 0.8982265591621399];
  // the same
  var otherMatrix = [0.9178107380867004, -0.04468444734811783, -0.3944951295852661, 0.1306413114070892, 0.9723015427589417, 0.1938103586435318, 0.3749079704284668, -0.2294186502695084, 0.8982265591621399] ;
  // no change
  var expected = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  var actual = RotationCalibrator.rotationDeltaMatrix(refMatrix, otherMatrix);
  
  deepEqual(actual, expected, true);
});

test("rotationDeltaMatrix - all zeroes", function (assert) {
  // all zeroes should be handled fine
  var refMatrix = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  // the same
  var otherMatrix = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  // no change
  var expected = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  var actual = RotationCalibrator.rotationDeltaMatrix(refMatrix, otherMatrix);
  
  deepEqual(actual, expected, true);
});

test("rotationDeltaMatrix - empty args", function (assert) {
  // an empty array should be handled fine
  var refMatrix = [];
  // doesn't have to be the same
  var otherMatrix = [];
  // no crash
  var expected = [];
  var actual = RotationCalibrator.rotationDeltaMatrix(refMatrix, otherMatrix);
  
  deepEqual(actual, expected, true);
});