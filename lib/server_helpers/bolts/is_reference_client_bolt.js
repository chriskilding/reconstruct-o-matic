/*jslint node: true */
"use strict";

/**
 * This takes in a room key and client
 * and figures out if that client is the reference client
 * for the room.
 *
 * @param referenceClients Persistence store mapping rooms to reference clients.
 */
module.exports = function (referenceClients, tuple, collector) {
    // Destructure
    var	roomkey     = tuple.roomkey,
        inputClient = tuple.client;
    
    referenceClients.get(roomkey, function (err, client) {
        if ((client === null) || (client === inputClient)) {
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
