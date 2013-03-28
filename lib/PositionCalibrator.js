var Triangles = require("./Triangles");

// Each position value should be an array of [x, y, z]
// and should be of a point on a common object (the user) they can both see
function distanceBetweenSensors(referencePosition, otherPosition) {  
  var refVector = Triangles.prepVector(referencePosition);
  var otherVector = Triangles.prepVector(otherPosition);
  
  // Now reverse them
  refVector = Triangles.reverseVector(refVector);
  otherVector = Triangles.reverseVector(otherVector);
  
  var theta = Triangles.angleBetweenVectors(refVector, otherVector);
  
  // hypotenuse = the distance between primary and other sensor
  // use the cosine rule to work with all triangles
  // What's the difference?
  return referencePosition.map(function(a, index, array) {
    return Triangles.cosineRule(a, otherPosition[index], theta);
  });
}

exports.distanceBetweenSensors = distanceBetweenSensors;