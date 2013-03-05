var _ = require('underscore');


// Combines OpenNI skeleton data to provide a more accurate overall model of the user's body
// from multiple angles
// NOTE: SKELETONS SHOULD ALREADY HAVE HAD THEIR ORIENTATION NORMALISED
// SO ALL POSITIONS ARE RELATIVE TO THE AUTHORITATIVE SENSOR
function reconstructSkeleton(skeletons) {

	switch (skeletons.length) {
		case 0:
			return {};
		case 1:
  		// Only one sensor was rigged up anyway
  		return skeletons[0];
  	default:
		  return skeletons.reduce(reduceSkeletons);  
	}

}

// Combine 2 skeletons into 1
function reduceSkeletons(a, b, index, array) {

  return recurse(a, b, []);
}

function recurse(a, b, output) {
  if ((a instanceof Array) && (b instanceof Array)) {
  	// Recursive
  	var reducedJoint = [ head(a), head(b) ].reduce(reduceJoints);
    return recurse(tail(a), tail(b), output.concat(reducedJoint));
  }
  else {  
    // Base case
    var reducedJoint = [ a, b ].reduce(reduceJoints);
    output.concat(reducedJoint);
    return output;    
  }
  
}

function head(arr) {
  return arr.slice(0, 0);
}

function tail(arr) {
  return arr.slice(1);
}

function reduceJoints(previousValue, currentValue, index, array) {
  var returner = previousValue;
  
  // If dominated by the next (current) value, update and replace
  if (returner.positionConfidence < currentValue.positionConfidence) {
    returner.positionConfidence = currentValue.positionConfidence;
    returner.position = currentValue.position;
  }
  
  if (returner.rotationConfidence < currentValue.rotationConfidence) {
    returner.rotationConfidence = currentValue.rotationConfidence;
    returner.rotation = currentValue.rotation;
  }

  return returner;
}

exports.reconstructSkeleton = reconstructSkeleton;
