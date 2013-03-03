var combiner = require("./SkeletonAggregator");
var calibrator = require("./SkeletonCalibrator");
var queue = require("./SimpleRedisQueue");

var calibrationDb = queue.create();
var realDb = queue.create();

// Push sensor calibration data
function pushCalibrate(roomId, userData) {
  calibrationDb.push(roomId, userData);
}

function finishCalibrate(roomId) {
  // Pop the reference user
  var refUser = calibrationDb.pop('calibrationSkeletons', roomId);
  
  // This leaves just the secondary users
  return calibrator.calibrate(refUser, calibrationDb.all('calibrationSkeletons'));
}

// Push "real" data
function pushReal(roomId, userData) {
  // Each source will be sending skeleton data at various times
  // They don't share a common clock
  // So we need some way to identify packets of data
  // as belonging to the same time window.
  
  // Add to the array of skeletons for the current frame
  realDb.push(roomId, userData);
}

function finishWindow(roomId) {
  // Retrieve all the skeletons
  var frameData = realDb.all(roomId);

  var result = combiner.reconstructSkeleton(frameData);

  // Clear out the list
  realDb.clear(roomId);

  // A non-null return also means we have moved on to the next frame of data
  return result;
}


/*function isAuthoritativeClient(roomId, clientId) {
  // Pick an arbitrary 'authoritative' data source
  // this will set the pace for the others
  // we have chosen that the first client in the list is the authoritative one.
  var authoritativeClientId = db.head('usergroups', roomId);
  
  return authoritativeClientId == clientId;
}*/

exports.push = push;