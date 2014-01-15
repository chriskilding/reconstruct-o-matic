/*jslint node: true */
"use strict";

var _ = require("underscore");
var SkeletonCalibrator = require("./SkeletonCalibrator");

// Returns a lambda
function calibrate(refUser, otherUser) {
 
    var skelDeltaFunc = SkeletonCalibrator.calibrate(refUser.skeleton, otherUser.skeleton);
    
    return function (realUser) {
        
        return {
            id: realUser.id,
            position: realUser.position,
            positionTracked: realUser.positionTracked,
            skeletonTracked: realUser.skeletonTracked,
            skeleton: skelDeltaFunc(realUser.skeleton)
        };
    };
}

function reconstructUserAsObject(realUser, positionDelta, rotationDelta) {
	var newSkeleton = SkeletonCalibrator.reconstructSkeletonAsObject(realUser.skeleton,
		positionDelta, rotationDelta);

	return {
            id: realUser.id,
            position: realUser.position,
            positionTracked: realUser.positionTracked,
            skeletonTracked: realUser.skeletonTracked,
            skeleton: newSkeleton
    };
}

exports.reconstructUserAsObject = reconstructUserAsObject;
exports.calibrate = calibrate;