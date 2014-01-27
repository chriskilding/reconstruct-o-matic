/*jslint node: true */
"use strict";

var SkeletonCalibrator = require("../SkeletonCalibrator");

module.exports = function (secondaryCalibrationPositionDeltas, secondaryCalibrationRotationDeltas) {
	this.process = function (tuple, collector) {
        
		// Destructure
		var roomkey          = tuple.roomkey,
			client           = tuple.client,
			referenceReading = tuple.referenceReading,
			secondaryReading = tuple.secondaryReading;
	

		// Compute delta
		var delta = SkeletonCalibrator.calibrateSkeleton(referenceReading.skeleton, secondaryReading.skeleton);

		// Save it
		secondaryCalibrationPositionDeltas.set(client, delta.position);
		secondaryCalibrationRotationDeltas.set(client, delta.rotation);

    };
};