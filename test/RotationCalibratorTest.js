// Bring in plugins
const closetest = require("./utilities/close");

// One more fixture
// just acts as 'another reading'
// that comes in after the calibration phase
const newRotation = [
  0.5315466523170471,
  -0.2101487815380096,
  -0.8205456733703613,
  0.06045396253466606,
  0.9756764769554138,
  -0.210717648267746,
  0.8448686599731445,
  0.06240064650774002,
  0.5313219428062439
];

QUnit.module("RotationCalibrator");

// This test is covered in lower-level detail by
// QuaternionTest#multiply
test("rotationDelta - identical values = no change", 1, function (assert) {
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

test("convertRealData - zero delta means no change", 1, function (assert) {
  // some real data
  var newQuat = RotationCalibrator.prepMatrix(Fixtures.real3x3);
  
  // idealised zero delta quaternion
  var deltaQuat = { x: 0, y: 0, z: 0, w: 1 };
    
  var actual = RotationCalibrator.convertRealData(newQuat, deltaQuat);
  var expected = Fixtures.real3x3;
  
  // should be no change
  closetest.arrayClose(actual, expected, Fixtures.maxDifference, true);
});

test("prepMatrix - sanity check", 1, function (assert) {
  // a real Kinect data sample
  var matrix = Fixtures.real3x3;

  // this is a temp placeholder
  // FIXME need to manually calculate what the expected quat should be
  var expected = { x: 0, y: 0, z: 0, w: 1 };
  
  var actual = RotationCalibrator.prepMatrix(matrix);
  
  // Should be no change!
  deepEqual(actual, expected, Fixtures.maxDifference, true);
});

// Zero delta, as if both sensors were right next to each other
test("calibrateRotation - simulate sensors next to each other", 1, function (assert) {
  // some real data
  var refMatrix = Fixtures.real3x3;
  // the same again
  var otherMatrix = Fixtures.real3x3;
    
  // And the calibration function is returned
  var actualFunc = RotationCalibrator.calibrateRotation(refMatrix, otherMatrix);
  
  // And some new data rolls in...
  var actualResult = actualFunc(newRotation);
  var expected = newRotation;
  
  // should be no change
  closetest.arrayClose(actualResult, expected, Fixtures.maxDifference, true);
});

// As if sensors were opposite each other
test("calibrateRotation - simulate sensors opposite each other", function (assert) {
  /*// some real data
  var refMatrix = Fixtures.real3x3;
  // the same again
  var otherMatrix = Fixtures.real3x3;
    
  // And the calibration function is returned
  var actualFunc = RotationCalibrator.calibrateRotation(refMatrix, otherMatrix);
  
  // And some new data rolls in...
  var actualResult = actualFunc(newRotation);
  var expected = newRotation;
  
  // should be no change
  closetest.arrayClose(actualResult, expected, Fixtures.maxDifference, true);*/
  ok(false, "FIXME - implement this test!");
});