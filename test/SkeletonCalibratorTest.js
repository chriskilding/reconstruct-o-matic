/*jslint node: true */
"use strict";

// Bring in plugins
var closetest = require("./utilities/close");
var Fixtures = require("./Fixtures");


QUnit.module("SkeletonCalibrator");

test("computeJointDelta - same rotation, different positions", 5, function (assert) {
    // With joint in sight of both sensors
    // where one sensor is located on the same alignment
    // as the primary sensor
    // but a bit further away
    // the values are
    var refJoint = {
        position: [3, 3, 3],
        rotation: Fixtures.real3x3
    };
    
    var otherJoint = {
        position: [15, 15, 15],
        rotation: Fixtures.real3x3
    };
    
    var actual = SkeletonCalibrator.computeJointDelta(refJoint, otherJoint);
    
    // should be a delta of about [-12, -12, -12]
    closetest.arrayClose(actual.positionDeltaVector, [-12, -12, -12], true);
    // there should be no difference in rotation
    // ie the quat should be {x: 0, y: 0, z: 0, w: 1}
    closetest.close(actual.rotationDeltaQuaternion.x, 0, Fixtures.maxDifference, true);
    closetest.close(actual.rotationDeltaQuaternion.y, 0, Fixtures.maxDifference, true);
    closetest.close(actual.rotationDeltaQuaternion.z, 0, Fixtures.maxDifference, true);
    closetest.close(actual.rotationDeltaQuaternion.w, 1, Fixtures.maxDifference, true);
});

test("calibrateJoint - refJoint has zero rotation matrix", 1, function (assert) {
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

test("calibrateJoint - otherJoint has zero rotation matrix", 1, function (assert) {
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

test("calibrateJoint - both have zero rotation matrices", 1, function (assert) {
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

test("calibrateJoint - no reference joint reading", 1, function (assert) {
    var otherJoint = {
        position: [15, 15, 15],
        rotation: Fixtures.zeroes3x3
    };
    
    var actual = SkeletonCalibrator.calibrateJoint(null, otherJoint);
    
    assert.equal(actual, null, true);
});

test("calibrateJoint - no other joint reading", 1, function (assert) {
    var refJoint = {
        position: [15, 15, 15],
        rotation: Fixtures.zeroes3x3
    };
    
    var actual = SkeletonCalibrator.calibrateJoint(refJoint, null);
    
    assert.equal(actual, null, true);
});

test("calibrateJoint - no readings whatsoever", 1, function (assert) {    
    var actual = SkeletonCalibrator.calibrateJoint(null, null);
    
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