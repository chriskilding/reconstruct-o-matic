// Bring in plugins
var closetest = require("./utilities/close");

QUnit.module("RotationCalibrator");

// Some calculations involve floating-point arithmetic
// which as the IEEE tells us creates a tiny amount of error
// that's not a problem here,
// just as long as the error stays below this threshold
// NOTE: floating-point error means you can't use QUnit `equal`
var maxFloatingPointErrorMargin, maxDifference = 0.000001;

// Some fixtures
var realData = [0.9178107380867004, -0.04468444734811783, -0.3944951295852661, 0.1306413114070892, 0.9723015427589417, 0.1938103586435318, 0.3749079704284668, -0.2294186502695084, 0.8982265591621399];
var zeroesMatrix = [0, 0, 0, 0, 0, 0, 0, 0, 0];

function floatingPointEqual(actual, expected) {
  var delta = Math.abs(actual - expected);
  
  ok(delta < maxFloatingPointErrorMargin, "floating-point actual value was acceptably close to the expected value");
}

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
  var refMatrix = realData;
  // the same
  var otherMatrix = realData;
  // no change
  var expected = zeroesMatrix;
  var actual = RotationCalibrator.rotationDeltaMatrix(refMatrix, otherMatrix);
  
  deepEqual(actual, expected, true);
});

test("rotationDeltaMatrix - all zeroes", function (assert) {
  // all zeroes should be handled fine
  var refMatrix = zeroesMatrix;
  // the same
  var otherMatrix = zeroesMatrix;
  // no change
  var expected = zeroesMatrix;
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

test("convertRealComponent - zero delta", function (assert) {
  var newRotationComponent = 0.5;
  // zero delta
  var deltaComponent = 0;
  
  var actual = RotationCalibrator.convertRealComponent(newRotationComponent, deltaComponent);
  //floatingPointEqual(result, 0.5);
  closetest.close(actual, 0.5, maxDifference, true);
  
});

test("convertRealComponent - delta equals newRotComponent size", function (assert) {
  var newRotationComponent = 0.5;
  // equally big delta
  var deltaComponent = 0.5;
  
  var actual = RotationCalibrator.convertRealComponent(newRotationComponent, deltaComponent);
  //floatingPointEqual(result, 0);
  closetest.close(actual, 0, maxDifference, true);
});

test("convertRealComponent - regular case", function (assert) {
  var newRotationComponent = 0.5;
  // zero delta
  var deltaComponent = 0.3;
  
  var actual = RotationCalibrator.convertRealComponent(newRotationComponent, deltaComponent);
  //floatingPointEqual(result, 0.2);
  closetest.close(actual, 0.2, maxDifference, true);
});

test("convertRealMatrix - zero delta means no change", function (assert) {
  // some real data
  var newMatrix = realData;
  // zero delta
  var deltaMatrix = zeroesMatrix;
  // no change
  var expected = realData;
  var actual = RotationCalibrator.convertRealMatrix(newMatrix, deltaMatrix);
  
  deepEqual(actual, expected, true);
});

test("convertRealMatrix - empty args", function (assert) {
  // an empty array should be handled fine
  var newMatrix = [];
  // doesn't have to be the same
  var deltaMatrix = [];
  // no crash
  var expected = [];
  var actual = RotationCalibrator.convertRealMatrix(newMatrix, deltaMatrix);
  deepEqual(actual, expected, true);
});