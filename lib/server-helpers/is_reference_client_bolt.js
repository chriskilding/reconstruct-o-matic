/*jslint node: true */
"use strict";

/**
 * This takes in a room key and client
 * and figures out if that client is the reference client
 * for the room.
 */
module.exports.execute = function (db, tuple, collector) {
	// Destructure
	var	roomkey     = tuple.roomkey,
	    client      = tuple.client;
	
	db.hget(roomkey, "referenceClient", function (err, referenceClient) {
		if (referenceClient === client) {
			collector.emit({
				isReference: true
			});
		} else {
			collector.emit({
				isReference: false
			});
		}
	});
};
