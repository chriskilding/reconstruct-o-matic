/*jslint node: true */
"use strict";

var _ = require("underscore");
var SkeletonCalibrator = require("./SkeletonCalibrator");

// Computes initial transform
function calibrateUser(refUser, otherUser) {
 
    var skelDelta = SkeletonCalibrator.calibrateSkeleton(refUser.skeleton, otherUser.skeleton);
    
	return {
		id: refUser.id,
		position: refUser.position,
		positionTracked: refUser.positionTracked,
		skeletonTracked: refUser.skeletonTracked,
		skeleton: skelDelta
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
exports.calibrateUser = calibrateUser;