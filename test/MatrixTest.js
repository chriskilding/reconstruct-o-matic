/*jslint node: true */
"use strict";

QUnit.module("Matrix");

test("expandMatrix - basic scenario", 1, function (assert) {
    var actual = Matrix.expandMatrix(Fixtures.real3x3);
    
    assert.deepEqual(actual, Fixtures.real4x4, true);
});

test("contractMatrix - basic scenario", 1, function (assert) {
    var actual = Matrix.contractMatrix(Fixtures.real4x4);
    
    assert.deepEqual(actual, Fixtures.real3x3, true);
});

test("expand then contract Matrix", 1, function (assert) {
    var expanded = Matrix.expandMatrix(Fixtures.real3x3);
    var contracted = Matrix.contractMatrix(expanded);
    
    assert.deepEqual(contracted, Fixtures.real3x3, true);
});