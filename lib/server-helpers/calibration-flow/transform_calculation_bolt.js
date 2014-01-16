/*jslint node: true */
"use strict";

var SkeletonCalibrator = require("../SkeletonCalibrator");

module.exports.execute = function (db, tuple, collector) {
	// Destructure
	var isReference = tuple.isReference,
		roomkey     = tuple.roomkey,
	    user        = tuple.user;
	
	if (isReference) {
		// The new standard has arrived
		db.hset(roomkey, "referenceCalibrationReading", user.skeleton);
	
		// Carry on, no adjustment required
		collector.emit({
			delta: null
		});
	} else {	
		// 1. Get the reference reading
		db.hget(roomkey, "referenceCalibrationReading", function (err, referenceReading) {
			
			// 2. Compute delta
			var delta = SkeletonCalibrator.calibrateSkeleton(referenceReading, user.skeleton);
		
			// 3. Emit it
			collector.emit({
				delta: delta
			});
        });
	}

};
