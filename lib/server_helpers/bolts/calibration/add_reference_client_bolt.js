/*jslint node: true */
"use strict";

module.exports = function (referenceClients, tuple, collector) {    

    // 1. Destructure.
    var roomkey   = tuple.roomkey,
        client    = tuple.client,
        frameData = tuple.frameData;
    
    // This is the reference client
    // Set the ref ID on the room.
    referenceClients.set(roomkey, client);				

    // TODO trigger recalibration of other clients
};


