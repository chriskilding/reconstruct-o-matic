/*jslint node: true */
"use strict";

QUnit.module("UserAggregator");

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
// test reducing 2 users
// -------------------------

test("reconstructUser - No users supplied", 1, function (assert) {
    var actual = UserAggregator.reconstructUser();
    // Need deepEqual because {} does not == {}!
    assert.deepEqual(actual, undefined, true);
});

test("reconstructUser - One user supplied", 1, function (assert) {
    var actual = UserAggregator.reconstructUser(Fixtures.realUser);
    // Need deepEqual because {} does not == {}!
    assert.deepEqual(actual, Fixtures.realUser, true);
});

test("reconstructUser - Multiple users supplied", 3, function (assert) {
    var actual = UserAggregator.reconstructUser(Fixtures.realUser, Fixtures.realUser);
    // Need deepEqual because {} does not == {}!
    assert.ok(actual.positionTracked, true);
    assert.ok(actual.skeletonTracked, true);
    assert.deepEqual(actual.skeleton, Fixtures.realUser.skeleton, true);
});