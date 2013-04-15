/*jslint node: true */
"use strict";

QUnit.module("PositionCalibrator");

test("prepVector - basic test", function (assert) {
    var input = [1, 1, 1];
    
    var actual = PositionCalibrator.prepVector(input);
    assert.deepEqual(actual, [-1, -1, -1], true);
});

test("deltaBetweenSensors - if sensors were next to each other", 1, function (assert) {
    var referencePosition = [3, 3, 3];
    var otherPosition = [4, 4, 4];
    var result = PositionCalibrator.deltaBetweenSensors(referencePosition, otherPosition);
    // Readings from 'other' would need to be moved 'down' by 1, 'left' by 1 etc.
    assert.deepEqual(result, [-1, -1, -1], true);
});

test("deltaBetweenSensors - negative number scenario", 1, function (assert) {
    var referencePosition = [-3, -3, -3];
    var otherPosition = [-4, -4, -4];
    var result = PositionCalibrator.deltaBetweenSensors(referencePosition, otherPosition);
    // Readings from 'other' would need to be moved 'up' by 1, 'right' by 1 etc.
    assert.deepEqual(result, [1, 1, 1], true);
});

test("convertRealVector - basic scenario", 1, function (assert) {
    var otherPosition = [4, 4, 4];
    var delta = [-1, -1, -1];
    
    var result = PositionCalibrator.convertRealVector(otherPosition, delta);
    // Just like it came from the primary sensor
    assert.deepEqual(result, [3, 3, 3], true);
});

test("calibratePosition - is the returned func referentially transparent", function (assert) {
    // With joint in sight of both sensors the values are
    var ref = [3, 3, 3];
    var other = [15, 15, 15];
    
    var func = PositionCalibrator.calibratePosition(ref, other);
    
    // If we feed it the same 'other' data again
    // is the output the same?
    var actual = func(other);
    
    // Just like it came from the primary sensor
    assert.deepEqual(actual, ref, true);
    
});

test("calibratePosition - basic scenario", function (assert) {
    // With joint in sight of both sensors the values are
    var ref = [3, 3, 3];
    var other = [15, 15, 15];
    // and thus delta should be [-12, -12, -12];
    
    var func = PositionCalibrator.calibratePosition(ref, other);
    
    // With hand moved behind so ref can't see it
    // we pretend the values from the other sensor's perspective are:
    // (given that it has been normalized by RotationCalibrator first)
    var otherReal = [13, 15, 13];
    
    var actual = func(otherReal);
    
    // Just like it came from the primary sensor
    assert.deepEqual(actual, [1, 3, 1], true);    
});

test("convertRealVector - floating point", 1, function (assert) {
    var otherPosition = [3.5, 3.5, 3.5];
    var delta = [-0.5, -0.5, -0.5];
    
    var result = PositionCalibrator.convertRealVector(otherPosition, delta);
    // Just like it came from the primary sensor
    assert.deepEqual(result, [3, 3, 3], true);
});