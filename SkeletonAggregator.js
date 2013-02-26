// Calibrate the system
// figure out the orientations of the sensor on each client
// relative to the authoritative client
function calibrate(skeletons) {

}

// Combines OpenNI skeleton data to provide a more accurate overall model of the user's body
// from multiple angles
// NOTE: SKELETONS SHOULD ALREADY HAVE HAD THEIR ORIENTATION NORMALISED
// SO ALL POSITIONS ARE RELATIVE TO THE AUTHORITATIVE SENSOR
function combine(skeletons) {
  var bestPositionConfidence = 0;
  var bestPosition;
  
  var bestRotationConfidence = 0;
  var bestRotation;
  
  for (var i = 0; i < skeletons.length; i++) {    
    if (skeletons[i].positionConfidence >= bestPositionConfidence) {
      bestPositionConfidence = skeletons[i].positionConfidence;
      bestPosition = skeletons[i].position;
    }
    
    if (skeletons[i].rotationConfidence >= bestRotationConfidence) {
      bestRotationConfidence = skeletons[i].rotationConfidence;
      bestRotation = skeletons[i].rotation;
    }
  }
  
  // Return the combined skeleton data in an identical format to input skeleton
  return {
    id: 1, // Don't really care
    position: bestPosition,
    positionConfidence: bestPositionConfidence,
    rotation: bestRotation,
    rotationConfidence: bestRotationConfidence
  };
}

exports.combine = combine;
exports.calibrate = calibrate;