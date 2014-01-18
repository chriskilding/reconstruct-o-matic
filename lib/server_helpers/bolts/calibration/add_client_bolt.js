/*jslint node: true */
"use strict";

/**
 * A new client joins a room...
 * let's get this thing persisted.
 */
module.exports = function (db) {
    this.process = function (tuple, context) {
        // Destructure
        var client      = tuple.client,
            roomkey     = tuple.roomkey,
            isReference = tuple.isReference;
            
        if (isReference) {
        	// This is the reference
			db.hset(roomkey, "referenceClient", client);
			
			// FIXME do I need this re-emit?
			context.emit({
				isReference: true
			});
        } else {
			// This will be secondary
			db.rpush(roomkey???????, client);
			
			context.emit({
				isReference: false
			});
        }
    };
};
