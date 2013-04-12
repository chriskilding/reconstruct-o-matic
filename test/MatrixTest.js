/*jslint node: true */
"use strict";

QUnit.module("Matrix");

test("expandMatrix - basic scenario", function() {
  var actual = Matrix.expandMatrix(Fixtures.real3x3);

  deepEqual(actual, Fixtures.real4x4, true);
});

test("contractMatrix - basic scenario", function() {
  var actual = Matrix.contractMatrix(Fixtures.real4x4);

  deepEqual(actual, Fixtures.real3x3, true);
});

test("expand then contract Matrix", function() {
  var expanded = Matrix.expandMatrix(Fixtures.real3x3);
  var contracted = Matrix.contractMatrix(expanded);

  deepEqual(contracted, Fixtures.real3x3, true);
});