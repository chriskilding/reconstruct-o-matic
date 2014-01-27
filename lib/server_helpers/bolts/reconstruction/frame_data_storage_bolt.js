/*jslint node: true */
"use strict";

/**
 * Takes in a new reading
 * if it comes from a secondary sensor, stockpile it
 * if it comes from reference sensor, finish + emit all data from this window.
 */
module.exports = function (clientReadings, roomReadings) {
	this.process = function (tuple, collector) {

		// First destructure the tuple
		var user        = tuple.user,
			isReference = tuple.isReference,
			roomkey     = tuple.roomkey,
			client      = tuple.client;
		
		// Perform push
		clientReadings.set(client, user);
	
		if (isReference) {
			// Window finished
			roomReadings.all(roomkey, function (err, users) {
				// Clear the list (this is async)
				roomReadings.removeAll(roomkey, function (err, removed) {
					// Emit skeletons
					collector.emit({
						users: users
					});
				});
			});
		}
	};
};
