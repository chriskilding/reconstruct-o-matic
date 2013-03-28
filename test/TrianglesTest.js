// Bring in plugins
var closetest = require("./utilities/close");

// Not great, but as good as you'll get with the JS floating point maths
var maxDifference = 0.02;

QUnit.module("Triangles");

// Tests using examples from http://www.mash.dept.shef.ac.uk/Resources/6_2scalarproduct.pdf

test("degreesToRadians - sanity check", function (assert) {
  // There are 2pi radians in a circle
  var expected = 2 * Math.PI;
  
  var actual = Triangles.degreesToRadians(360);
  
  closetest.close(actual, expected, maxDifference, true);
});

test("radiansToDegrees - sanity check", function (assert) {
  // There are pi radians in a semicircle
  var expected = 180;
  
  var actual = Triangles.radiansToDegrees(Math.PI);
  
  closetest.close(actual, expected, maxDifference, true);
});

test("scalarProduct - matches worked example", function (assert) {
  // REMEMBER, JS maths uses RADIANS
  var rads = Triangles.degreesToRadians(30);
  var actual = Triangles.scalarProduct(8, 7, rads);
  
  closetest.close(actual, 48.5, maxDifference, true);
});

test("scalarProductOfVectors - matches worked example", function (assert) {
  // remember to create Sylvester vectors first
  var a = Triangles.prepVector([5, 3, -2]);
  var b = Triangles.prepVector([8, -9, 11]);
  
  var actual = Triangles.scalarProductOfVectors(a, b);
  
  equal(actual, -9, true);
});

test("angleBetweenVectors - matches worked example", function (assert) {
  // remember to create Sylvester vectors first
  var a = Triangles.prepVector([2, 3, 5]);
  var b = Triangles.prepVector([1, -2, 3]);
  
  var raw = Triangles.angleBetweenVectors(a, b);
  var actual = Triangles.radiansToDegrees(raw);
  
  closetest.close(actual, 61.5, maxDifference, true);
});

test("cosineRule - matches 3-4-5 rule", function (assert) {
  var a = 3;
  var b = 4;
  var theta = Triangles.degreesToRadians(90);

  var actual = Triangles.cosineRule(a, b, theta);
  
  closetest.close(actual, 5, maxDifference, true);
});