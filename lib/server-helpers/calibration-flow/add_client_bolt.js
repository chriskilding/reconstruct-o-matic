/*jslint node: true */
"use strict";

/**
 * A new client joins a room...
 * let's get this thing persisted.
 */
module.exports.execute = function (db, tuple, collector) {
	// Destructure
	var client      = tuple.client,
		roomkey     = tuple.roomkey;
		
	db.hget(roomkey, "referenceClient", function (err, referenceClient) {
		if (referenceClient) {
			// This will be secondary
			db.rpush(roomkey???????, client);
			
			collector.emit({
				isReference: false
			});
		} else {
			// This is the reference
			db.hset(roomkey, "referenceClient", client);
			
			collector.emit({
				isReference: true
			});
		}
	});

};
