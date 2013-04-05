// Bring in plugins
const closetest = require("./utilities/close");

QUnit.module("RotationCalibrator");

// This test is covered in lower-level detail by
// QuaternionTest#multiply
test("rotationDelta - identical values = no change", function (assert) {
  // a real Kinect data sample
  var refMatrix = Fixtures.real3x3;
  // the same
  var otherMatrix = Fixtures.real3x3;

  // idealised delta quaternion
  // which causes no change in any direction
  var expected = { x: 0, y: 0, z: 0, w: 1 };
  
  var actual = RotationCalibrator.rotationDelta(refMatrix, otherMatrix);
  
  closetest.arrayClose(actual, expected, Fixtures.maxDifference, true);
});

/*test("rotationDelta - all zeroes", function (assert) {
  // all zeroes should be handled fine
  var refMatrix = Fixtures.zeroes3x3;
  // the same
  var otherMatrix = Fixtures.zeroes3x3;
  // no change
  var expected = Fixtures.zeroes3x3;
  var actual = RotationCalibrator.rotationDelta(refMatrix, otherMatrix);
  
  deepEqual(actual, expected, true);
});

/*test("rotationDelta - empty args", function (assert) {
  // an empty array should be handled fine
  var refMatrix = [];
  // doesn't have to be the same
  var otherMatrix = [];
  // no crash
  var expected = [];
  var actual = RotationCalibrator.rotationDeltaMatrix(refMatrix, otherMatrix);
  
  deepEqual(actual, expected, true);
});

test("convertRealData - zero delta means no change", function (assert) {
  // some real data
  var newMatrix = realData;
  // zero delta
  var deltaMatrix = zeroesMatrix;
  // no change
  var expected = realData;
  var actual = RotationCalibrator.convertRealMatrix(newMatrix, deltaMatrix);
    
  closetest.arrayClose(actual, expected, maxDifference, true);
});

test("convertRealData - empty args", function (assert) {
  // an empty array should be handled fine
  var newMatrix = [];
  // doesn't have to be the same
  var deltaMatrix = [];
  // no crash
  var expected = [];
  var actual = RotationCalibrator.convertRealMatrix(newMatrix, deltaMatrix);
  deepEqual(actual, expected, true);
});*/