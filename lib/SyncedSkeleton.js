var combiner = require("./SkeletonAggregator");
var calibrator = require("./SkeletonCalibrator");
var queue = require("./SimpleRedisQueue");

var calibrationDb = queue.create();
var realDb = queue.create();

// Got a calibration update from primary sensor
function setReferencePoint(roomId, userData) {
  calibrationDb.push(roomId, userData);
}

// Push sensor calibration data
function getCalibrationFunc(roomId, userData) {
  // Want the latest calibration ref data from reference user
  var refUserData = calibrationDb.last(roomId);
  
  // Return the calibration function
  if (refUserData) {
    return calibrator.calibrate(refUserData, userData);
  }
}

// Push "real" data
// NOTE:
// Each source will be sending skeleton data at various times
// They don't share a common clock
// So you need some way to identify packets of data
// as belonging to the same time window.
function pushReal(roomId, userData) {  
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

exports.setReferencePoint = setReferencePoint;
exports.getCalibrationFunc = getCalibrationFunc;

exports.pushReal = pushReal;
exports.finishWindow = finishWindow;
