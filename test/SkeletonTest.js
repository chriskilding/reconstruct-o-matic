/*jslint node: true */
"use strict";

var Fixtures = require("./Fixtures");
var sinon = require("sinon");
var _ = require("underscore");

var skeleton;

var client1 = "abc123";
var client2 = "gef456";

QUnit.module("Skeleton", {
    setup: function () {
        skeleton = new Skeleton();
    },
    teardown: function () {
        skeleton = null;
    }
});

test("Skeleton - basic config checks", 2, function (assert) {
    assert.equal(skeleton.realReadings.length, 0, true);
    assert.ok(!skeleton.referenceCalibrationReading, true);
});

test("pushRealData - one thing", 1, function (assert) {
    skeleton.pushRealData(Fixtures.realUser);
    
    // Something was added
    assert.equal(skeleton.realReadings[0], Fixtures.realUser, true);
});

test("getReferenceCalibrationFunc - uses passthrough func", 1, function (assert) {
    var func = skeleton.getReferenceCalibrationFunc(Fixtures.realUser);
        
    // Uses the passthrough
    assert.deepEqual(func, SkeletonCalibrator.passthrough, true);
});

test("finishWindow - 2 identical readings", 1, function (assert) {
    // Push both readings
    skeleton.pushRealData(Fixtures.realUser);
    skeleton.pushRealData(Fixtures.realUser);
    
    // Now given a new reading, nothing should be different
    var actual = skeleton.finishWindow();
    
    // Returned user data is effectively the same as both inputs
    assert.deepEqual(actual, Fixtures.realUser, true);
});

/*test("getSecondaryCalibrationFunc - no change if identical readings", 1, function (assert) {
    // Push first thing
    skeleton.getReferenceCalibrationFunc(Fixtures.realUser);
    
    // Now add secondary reading, which is the same
    var func = skeleton.getSecondaryCalibrationFunc(Fixtures.realUser);
    
    // Now given a new reading, nothing should be different
    var actual = func(Fixtures.realUser.skeleton);
    
    // Uses the passthrough
    //assert.deepEqual(func, SkeletonCalibrator.passthrough, true);
});*/