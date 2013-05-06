/*jslint node: true */
"use strict";

var Fixtures = require("./Fixtures");

QUnit.module("SkeletonAggregator");

var _ = require("underscore");

// A has the higher reading confidences

var a = {
    id: 15,
    position: [1, 1, 1],
    positionconfidence: 0.8,
    rotation: Fixtures.real3x3,
    rotationconfidence: 0.9
};

var b = {
    id: 15,
    position: [3, 3, 3],
    positionconfidence: 0.5,
    // TODO give b a proper rotation!
    rotation: [],
    rotationconfidence: 0.3
};

// -------------------------
// test reducing 2 positions
// -------------------------

test("reduceData - A has better position", 2, function (assert) {
    var actual = SkeletonAggregator.reduceData(
        a.position,
        a.positionconfidence,
        b.position,
        b.positionconfidence
    );
    
    assert.deepEqual(actual.value, a.position, true);
    assert.equal(actual.confidence, a.positionconfidence, true);
});

test("reduceData - A has better position with args other way round", 2, function (assert) {
    var actual = SkeletonAggregator.reduceData(
        b.position,
        b.positionconfidence,
        a.position,
        a.positionconfidence
    );
    
    assert.deepEqual(actual.value, a.position, true);
    assert.equal(actual.confidence, a.positionconfidence, true);
});

// -------------------------
// test reducing 2 rotations
// -------------------------

test("reduceData - A has better rotation", 2, function (assert) {
    var actual = SkeletonAggregator.reduceData(
        a.rotation,
        a.rotationconfidence,
        b.rotation,
        b.rotationconfidence
    );
    
    assert.deepEqual(actual.value, a.rotation, true);
    assert.equal(actual.confidence, a.rotationconfidence, true);
});

test("reduceData - A has better rotation with args other way round", 2, function (assert) {
    var actual = SkeletonAggregator.reduceData(
        b.rotation,
        b.rotationconfidence,
        a.rotation,
        a.rotationconfidence
    );
    
    assert.deepEqual(actual.value, a.rotation, true);
    assert.equal(actual.confidence, a.rotationconfidence, true);
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