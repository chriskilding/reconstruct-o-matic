/*jslint node: true */
"use strict";

QUnit.module("RATPositionCalibrator");

test("distanceBetweenSensors - works with 3-4-5 rule", 1, function (assert) {
    var referencePosition = [3, 3, 3];
    var otherPosition = [4, 4, 4];
    var result = RATPositionCalibrator.distanceBetweenSensors(referencePosition, otherPosition);
    assert.deepEqual(result, [5, 5, 5], true);
});

test("distanceBetweenSensors - doesn't crash with negative numbers", 1, function (assert) {
    var referencePosition = [-3, -3, -3];
    var otherPosition = [-4, -4, -4];
    var result = RATPositionCalibrator.distanceBetweenSensors(referencePosition, otherPosition);
    assert.deepEqual(result, [5, 5, 5], true);
});

test("convertPositionValue - works with 3-4-5 rule", 1, function (assert) {
    var hypotenuse = [5, 5, 5];
    var otherPosition = [4, 4, 4];
    var result = RATPositionCalibrator.convertPositionValue(hypotenuse, otherPosition);
    assert.deepEqual(result, [3, 3, 3], true);
});

test("convertPositionValue - hyp smaller than opp or adj doesn't yield NaNs", 1, function (assert) {
    var hypotenuse = [4, 4, 4];
    var otherPosition = [5, 5, 5];
    var result = RATPositionCalibrator.convertPositionValue(hypotenuse, otherPosition);
    assert.deepEqual(result, [3, 3, 3], true);
});