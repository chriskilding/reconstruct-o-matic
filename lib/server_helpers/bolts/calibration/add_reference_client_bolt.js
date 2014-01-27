/*jslint node: true */
"use strict";

module.exports = function (referenceClients, referenceCalibrationReadings, tuple, collector) {    

    // 1. Destructure.
    var roomkey   = tuple.roomkey,
        client    = tuple.client,
        frameData = tuple.frameData;
    
    // This is the reference client
    // Set the ref ID on the room.
    referenceClients.set(roomkey, client);				

    // Set one frame's worth of data from the ref client
    // This is needed to compute calibration transforms.
    referenceCalibrationReadings.set(roomkey, frameData.skeleton);

    // TODO trigger recalibration of other clients
};


