// Bring in plugins
const closetest = require("./utilities/close");
const maxDifference = 0.000001;

QUnit.module("RotationCalibrator");

// Some fixtures
const real3x3 = [0.9178107380867004, -0.04468444734811783, -0.3944951295852661, 0.1306413114070892, 0.9723015427589417, 0.1938103586435318, 0.3749079704284668, -0.2294186502695084, 0.8982265591621399];
const zeroesMatrix = [0, 0, 0, 0, 0, 0, 0, 0, 0];

test("rotationDelta - identical values = no change", function (assert) {
  // a real Kinect data sample
  var refMatrix = real3x3;
  // the same
  var otherMatrix = real3x3;
  // no change
  var expected = zeroesMatrix;
  var actual = RotationCalibrator.rotationDelta(refMatrix, otherMatrix);
  
  deepEqual(actual, expected, true);
});

/*test("rotationDelta - all zeroes", function (assert) {
  // all zeroes should be handled fine
  var refMatrix = zeroesMatrix;
  // the same
  var otherMatrix = zeroesMatrix;
  // no change
  var expected = zeroesMatrix;
  var actual = RotationCalibrator.rotationDeltaMatrix(refMatrix, otherMatrix);
  
  deepEqual(actual, expected, true);
});

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