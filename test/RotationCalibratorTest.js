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
  // without floating point errors
  // which causes no change in any direction
  var expected = { x: 0, y: 0, z: 0, w: 1 };
  
  var actual = RotationCalibrator.rotationDelta(refMatrix, otherMatrix);
  
  // Should be no change!
  closetest.arrayClose(actual, expected, Fixtures.maxDifference, true);
});

test("convertRealData - zero delta means no change", function (assert) {
  // some real data
  var newQuat = RotationCalibrator.prepMatrix(Fixtures.real3x3);
  
  // idealised zero delta quaternion
  var deltaQuat = { x: 0, y: 0, z: 0, w: 1 };
    
  var actual = RotationCalibrator.convertRealData(newQuat, deltaQuat);
  var expected = Fixtures.real3x3;
  
  // should be no change
  closetest.arrayClose(actual, expected, Fixtures.maxDifference, true);
});

test("prepMatrix - sanity check", function (assert) {
  // a real Kinect data sample
  var matrix = Fixtures.real3x3;

  // this is a temp placeholder
  // FIXME need to manually calculate what the expected quat should be
  var expected = { x: 0, y: 0, z: 0, w: 1 };
  
  var actual = RotationCalibrator.prepMatrix(matrix);
  
  // Should be no change!
  deepEqual(actual, expected, Fixtures.maxDifference, true);
});

/*
test("rotationDelta - empty args", function (assert) {
  // an empty array should be handled fine
  var refMatrix = [];
  // doesn't have to be the same
  var otherMatrix = [];
  // no crash
  var expected = [];
  var actual = RotationCalibrator.rotationDeltaMatrix(refMatrix, otherMatrix);
  
  deepEqual(actual, expected, true);
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