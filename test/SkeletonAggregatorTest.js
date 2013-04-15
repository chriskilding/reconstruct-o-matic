/*jslint node: true */
"use strict";

QUnit.module("SkeletonAggregator");

var _ = require("underscore");

// A has the higher reading confidences

var a = {
    id: 15,
    position: [1, 1, 1],
    positionConfidence: 0.8,
    rotation: Fixtures.real3x3,
    rotationConfidence: 0.9
};

var b = {
    id: 15,
    position: [3, 3, 3],
    positionConfidence: 0.5,
    // TODO give b a proper rotation!
    rotation: [],
    rotationConfidence: 0.3
};

// -------------------------
// test reducing 2 positions
// -------------------------

test("reduceData - A has better position", 2, function (assert) {
    var actual = SkeletonAggregator.reduceData(
        a.position,
        a.positionConfidence,
        b.position,
        b.positionConfidence
    );
    
    assert.deepEqual(actual.value, a.position, true);
    assert.equal(actual.confidence, a.positionConfidence, true);
});

test("reduceData - A has better position with args other way round", 2, function (assert) {
    var actual = SkeletonAggregator.reduceData(
        b.position,
        b.positionConfidence,
        a.position,
        a.positionConfidence
    );
    
    assert.deepEqual(actual.value, a.position, true);
    assert.equal(actual.confidence, a.positionConfidence, true);
});

// -------------------------
// test reducing 2 rotations
// -------------------------

test("reduceData - A has better rotation", 2, function (assert) {
    var actual = SkeletonAggregator.reduceData(
        a.rotation,
        a.rotationConfidence,
        b.rotation,
        b.rotationConfidence
    );
    
    assert.deepEqual(actual.value, a.rotation, true);
    assert.equal(actual.confidence, a.rotationConfidence, true);
});

test("reduceData - A has better rotation with args other way round", 2, function (assert) {
    var actual = SkeletonAggregator.reduceData(
        b.rotation,
        b.rotationConfidence,
        a.rotation,
        a.rotationConfidence
    );
    
    assert.deepEqual(actual.value, a.rotation, true);
    assert.equal(actual.confidence, a.rotationConfidence, true);
});

// -------------------------
// moving on...
// -------------------------

test("reduceJoints - A has stronger reading", 1, function (assert) {
    var actual = SkeletonAggregator.reduceJoints(a, b);

    // Essentially, each key and value should 'equal' the a object
    assert.ok(_.isEqual(actual, a), true);
});

test("reduceJoints - A has stronger reading with args other way round", 1, function (assert) {
    var actual = SkeletonAggregator.reduceJoints(b, a);

    // Essentially, each key and value should 'equal' the a object
    assert.ok(_.isEqual(actual, a), true);
});

test("reconstructSkeleton - no args", 1, function (assert) {
    var actual = SkeletonAggregator.reconstructSkeleton();

    // Should get empty object back
    assert.deepEqual(actual, undefined, true);
});

test("reconstructSkeleton - one arg", 1, function (assert) {
    var actual = SkeletonAggregator.reconstructSkeleton([Fixtures.realUser.skeleton]);

    // Should be passed through
    assert.deepEqual(actual, Fixtures.realUser.skeleton, true);
});