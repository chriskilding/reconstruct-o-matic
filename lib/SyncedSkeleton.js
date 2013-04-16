/*jslint node: true */
"use strict";

var UserAggregator = require("./UserAggregator");
var SkeletonCalibrator = require("./SkeletonCalibrator");
var queue = require("./redis/SimpleRedisQueue");

var calibrationDb = queue.create(1);
var realDb = queue.create(2);

// Got a calibration update from primary sensor
function setReferencePoint(roomId, userData) {
    calibrationDb.push(roomId, userData);
}

// THIS IS ASYNC
function getCalibrationFunc(roomId, userData, callback) {
    // Want the latest calibration ref data from reference user
    calibrationDb.last(roomId, function (refUserData) {
        // Now we have the data, Return the calibration function
        if (refUserData) {
            // send back the computed calibrator func
            callback(SkeletonCalibrator.calibrate(refUserData.skeleton, userData.skeleton));
        } else {
            // just create a passthrough
            callback(SkeletonCalibrator.passthrough);
        }
    });
}

// Clear the room data from the dbs
function clear(roomId) {
    calibrationDb.clear(roomId);
    realDb.clear(roomId);
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

// THIS IS ASYNC
function finishWindow(roomId, outerCallback) {
    // Retrieve all the skeletons
    realDb.all(roomId, function (frameData) {
        if (frameData) {
            // Got the frame data, now reconstruct
            var result = UserAggregator.condenseUser(frameData);
            
            // Clear out the list
            realDb.clear(roomId);
                
            // result now equals the reconstructed skeleton
            // TODO what if there is no data for this frame?
            outerCallback(result);
        }
    });
}

exports.setReferencePoint = setReferencePoint;
exports.getCalibrationFunc = getCalibrationFunc;
exports.pushReal = pushReal;
exports.finishWindow = finishWindow;
exports.clear = clear;