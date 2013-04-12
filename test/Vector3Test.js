/*jslint node: true */
"use strict";

QUnit.module("Vector3");

var closetest = require("./utilities/close");

test("add - simple case", 1, function (assert) {
    var a = [1, 1, 1];
    var b = [2, 2, 2];
    
    assert.deepEqual(Vector3.add(a, b), [3, 3, 3], true);
});

test("divideByValue - simple case", 1, function (assert) {
    var a = [6, 6, 6];
    
    assert.deepEqual(Vector3.divideByValue(a, 3), [2, 2, 2], true);
});

test("addVectors - simple case", 1, function (assert) {
    var arr = [
        [6, 6, 6],
        [4, 4, 4],
        [5, 5, 5]
    ];
    
    var actual = Vector3.addVectors(arr);
    var expected = [15, 15, 15];
    
    assert.deepEqual(actual, expected, true);
});

test("averageOfVectors - simple case", 1, function (assert) {
    var arr = [
        [2, 2, 2],
        [4, 4, 4],
        [6, 6, 6]
    ];
    
    var actual = Vector3.averageOfVectors(arr);
    var expected = [4, 4, 4];
    
    assert.deepEqual(actual, expected, true);
});

test("applyQuaternion - no delta = no change", 3, function (assert) {
    var delta = { x: 0, y: 0, z: 0, w: 1 };
    
    var position = { x: 1, y: 1, z: 1 };
    
    var actual = Vector3.applyQuaternion(position, delta);
    
    assert.equal(actual.x, position.x, true);
    assert.equal(actual.y, position.y, true);
    assert.equal(actual.z, position.z, true);

});

test("applyQuaternion - rotate in z by 90 degrees", 1, function (assert) {
    var delta = Fixtures.zRotation90;
    
    var position = { x: 1, y: 1, z: 1 };
    
    var actual = Vector3.applyQuaternion(position, delta);
    
    // The vector should have been rotated in z
    var expected = {
        x: 0,
        y: 0,
        z: 0
    };
    
    assert.equal(actual, expected, true);
});