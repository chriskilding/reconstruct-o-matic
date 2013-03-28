// Utility functions for working with triangles.
var sylvester = require("sylvester");
var Vector = sylvester.Vector;

function radiansToDegrees (radians) {
  return radians * (180 / Math.PI);
}

// The JS Math.foo methods all use radians!
function degreesToRadians (degrees) {
  return degrees * (Math.PI / 180);
}

// Turn a plain JS array into a Sylvester Vector
function prepVector(arr) {
  return Vector.create(arr);
}

// Is a vector pointing the wrong way? Reverse it!
function reverseVector(vec) {
  return vec.multiply(-1);
}

// For vectors
function scalarProductOfVectors(a, b) {
  return a.dot(b);
}

// For moduluses of A and B
function scalarProduct(modulusA, modulusB, thetaDegrees) {
  console.log('mod', Math.cos(thetaDegrees));
  return modulusA * modulusB * Math.cos(thetaDegrees);
}

// Gives cos of theta
function cosTheta(a, b, scalarProduct) {
  return scalarProduct / (a.modulus() * b.modulus());
}

// Undoes cos to yield just theta
function thetaDegrees(a, b, scalarProduct) {
  return Math.acos(cosTheta(a, b, scalarProduct));
}

// Angle between two Sylvester vectors IN RADIANS
function angleBetweenVectors(a, b) {
  return a.angleFrom(b);
}

// Yields the 'long' side c, given a, b, and angle between a and b, theta
// Remember this works in ONE dimension
function cosineRule (a, b, theta) {
  return Math.sqrt((a^2) + (b^2) - 2 * a * b * Math.cos(theta));
}

exports.radiansToDegrees = radiansToDegrees;
exports.degreesToRadians = degreesToRadians;
exports.scalarProductOfVectors = scalarProductOfVectors;
exports.reverseVector = reverseVector;
exports.scalarProduct = scalarProduct;
exports.prepVector = prepVector;
exports.thetaDegrees = thetaDegrees;
exports.angleBetweenVectors = angleBetweenVectors;
exports.cosineRule = cosineRule;