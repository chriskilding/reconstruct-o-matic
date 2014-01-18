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
            roomkey     = tuple.roomkey;
            
        db.hget(roomkey, "referenceClient", function (err, referenceClient) {
            if (referenceClient) {
                // This will be secondary
                db.rpush(roomkey???????, client);
                
                context.emit({
                    isReference: false
                });
            } else {
                // This is the reference
                db.hset(roomkey, "referenceClient", client);
                
                context.emit({
                    isReference: true
                });
            }
        });
    };
};
