/*jslint node: true */
"use strict";

var UserCalibrator = require("../UserCalibrator");

/**
 * Applies the provided transformation (if any)
 * to a skeleton (wrapped in a user)
 * to make it suitable for further processing.
 */
module.exports = function () {
	this.process = function (tuple, collector) {
		// Destructure the tuple
		var user          = tuple.user,
			delta         = tuple.delta;
	
		var output = {
			user: user
		};
	
		// If a delta was supplied, gotta tweak the user (skeleton) first
		// If not, the reading will simply pass through untouched.
		if (delta) {
			var positionDelta = tuple.positionDelta,
				rotationDelta = tuple.rotationDelta;
			
			// Transform it
			var transformed = UserCalibrator.reconstructUserAsObject(user,
				positionDelta, rotationDelta);
		
			// Use this instead
			output.user = transformed;
		}
		
		// Emit it
		collector.emit(output);
	};
};
