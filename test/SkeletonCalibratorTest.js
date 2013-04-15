/*jslint node: true */
"use strict";

QUnit.module("SkeletonCalibrator");

/*test("computeJointDelta - basic scenario", function (assert) {
    // With joint in sight of both sensors the values are
    var refJoint = [3, 3, 3];
    var otherJoint = [15, 15, 15];
    
    
    var actual = SkeletonCalibrator.computeJointDelta(refJoint, otherJoint);
    
});*/

test("calibrateJoint - refJoint has zero rotation matrix", function (assert) {
    // Reference sensor can't quite detect the rotation
    var refJoint = {
        position: [3, 3, 3],
        rotation: Fixtures.zeroes3x3
    };
    
    var otherJoint = {
        position: [15, 15, 15],
        rotation: Fixtures.real3x3
    };
    
    var actual = SkeletonCalibrator.calibrateJoint(refJoint, otherJoint);
    
    assert.equal(actual, null, true);
});

test("calibrateJoint - otherJoint has zero rotation matrix", function (assert) {
    // Secondary sensor can't quite detect the rotation
    var refJoint = {
        position: [3, 3, 3],
        rotation: Fixtures.real3x3
    };
    
    var otherJoint = {
        position: [15, 15, 15],
        rotation: Fixtures.zeroes3x3
    };
    
    var actual = SkeletonCalibrator.calibrateJoint(refJoint, otherJoint);
    
    assert.equal(actual, null, true);
});

test("calibrateJoint - both have zero rotation matrices", function (assert) {
    // Neither sensor can detect the rotation
    var refJoint = {
        position: [3, 3, 3],
        rotation: Fixtures.zeroes3x3
    };
    
    var otherJoint = {
        position: [15, 15, 15],
        rotation: Fixtures.zeroes3x3
    };
    
    var actual = SkeletonCalibrator.calibrateJoint(refJoint, otherJoint);
    
    assert.equal(actual, null, true);
});

// This is more of an integration test
// as it requires syncing of coordinate systems
// which in turn requires the RotationCalibrator
/*test("calibratePosition - basic scenario", function (assert) {
    // With joint in sight of both sensors the values are
    var ref = [3, 3, 3];
    var other = [15, 15, 15];
    // and thus
    var delta = [-12, -12, -12];
    
    var func = PositionCalibrator.calibratePosition(ref, other);
    
    // With hand moved behind so ref can't see it
    // we pretend the values from the other sensor's perspective are:
    // a bit to the left
    // same height
    // a bit towards the sensor
    var otherReal = [13, 15, 13];
    
    var actual = func(otherReal);
    
    // Just like it came from the primary sensor
    assert.deepEqual(actual, [5, 3, 5], true);
    
    // var otherPosition = [4, 4, 4];
    // var delta = [-1, -1, -1];
    // var result = PositionCalibrator.convertRealVector(otherPosition, delta);
});
*/