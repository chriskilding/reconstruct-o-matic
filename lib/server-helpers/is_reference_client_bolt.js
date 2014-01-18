/*jslint node: true */
"use strict";

/**
 * This takes in a room key and client
 * and figures out if that client is the reference client
 * for the room.
 */
module.exports = function (db) {
    this.process = function (tuple, context) {
        // Destructure
        var	roomkey     = tuple.roomkey,
            client      = tuple.client;
        
        db.hget(roomkey, "referenceClient", function (err, referenceClient) {
            if (referenceClient === client) {
                context.emit({
                    isReference: true
                });
            } else {
                context.emit({
                    isReference: false
                });
            }
        });

    };
};
