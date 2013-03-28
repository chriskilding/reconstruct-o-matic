var Triangles = require("./Triangles");

// If start with a ref position [3, 3, 3] and other position [4, 4, 4]
// those are the distances of the joint from each Kinect
// now reverse the vectors so we have the joint at centre of coord system
// making the Kinects located at [-3, -3, -3] and [-4, -4, -4]
// the Euclidean distance between each of those will yield the dist between sensors
//
// Each position value should be an array of [x, y, z]
// and should be of a point on a common object (the user) they can both see
function deltaBetweenSensors(referencePosition, otherPosition) {  
  var refVector = prepVector(referencePosition).elements;
  var otherVector = prepVector(otherPosition).elements;
  // hypotenuse = the distance between primary and other sensor
  // What's the difference?
  return ret = refVector.map(function(a, index) {
    return otherVector[index] - a;
  });  
}

// Turns an incoming JS array into right format, and reverses it
function prepVector(arr) {
  return Triangles.reverseVector(Triangles.prepVector(arr));
}


exports.deltaBetweenSensors = deltaBetweenSensors;
exports.prepVector = prepVector;