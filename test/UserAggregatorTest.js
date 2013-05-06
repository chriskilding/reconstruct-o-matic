/*jslint node: true */
"use strict";

QUnit.module("UserAggregator");

var _ = require("underscore");

var Fixtures = require("./Fixtures");

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
// test reducing 2 users
// -------------------------

test("condenseUser - No users supplied", 1, function (assert) {
    var actual = UserAggregator.condenseUser();
    // Need deepEqual because {} does not == {}!
    assert.deepEqual(actual, undefined, true);
});

test("condenseUser - One user supplied", 1, function (assert) {
    var actual = UserAggregator.condenseUser(Fixtures.realUser);
    // Need deepEqual because {} does not == {}!
    assert.deepEqual(actual, Fixtures.realUser, true);
});

test("condenseUser - Multiple users supplied", 3, function (assert) {
    var actual = UserAggregator.condenseUser(Fixtures.realUser, Fixtures.realUser);
    // Need deepEqual because {} does not == {}!
    assert.ok(actual.positionTracked, true);
    assert.ok(actual.skeletonTracked, true);
    assert.deepEqual(actual.skeleton, Fixtures.realUser.skeleton, true);
});