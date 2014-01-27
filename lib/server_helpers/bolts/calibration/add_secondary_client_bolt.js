/*jslint node: true */
"use strict";

var SkeletonCalibrator = require("../SkeletonCalibrator");

module.exports = function (referenceCalibrationReadings, secondaryCalibrationDeltas, tuple, collector) {
        
    // Destructure
    var roomkey     = tuple.roomkey,
        user        = tuple.user,
        clientId    = tuple.clientId;
    

    // 1. Get the reference reading
    referenceCalibrationReadings.get(roomkey, function (err, referenceReading) {
        
        // 2. Compute delta
        var delta = SkeletonCalibrator.calibrateSkeleton(referenceReading, user.skeleton);
    
        // 3. Save it
        secondaryCalibrationDeltas.set(clientId, delta.position, delta.rotation);
        
    });
};
