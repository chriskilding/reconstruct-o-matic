var Triangles = require("./Triangles");

// Each position value should be an array of [x, y, z]
// and should be of a point on a common object (the user) they can both see
function distanceBetweenSensors(referencePosition, otherPosition) {  
  var refVector = prepVector(referencePosition);
  var otherVector = prepVector(otherPosition);
    
  var theta = Triangles.angleBetweenVectors(refVector, otherVector);
  console.log(refVector, otherVector, theta);
  // hypotenuse = the distance between primary and other sensor
  // use the cosine rule to work with all triangles
  // What's the difference?
  return referencePosition.map(function(a, index, array) {
    return Triangles.cosineRule(a, otherPosition[index], theta);
  });
}

// Turns an incoming JS array into right format, and reverses it
function prepVector(arr) {
  return Triangles.reverseVector(Triangles.prepVector(arr));
}

exports.distanceBetweenSensors = distanceBetweenSensors;
exports.prepVector = prepVector;