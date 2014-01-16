/*jslint node: true */
"use strict";

var UserCalibrator = require("../UserCalibrator");
var state = require("state");

// A skeleton shared by a number of clients
// who contribute data to reconstruct it
module.exports = function (fsm) {
    var referenceCalibrationReading = undefined;

    state(fsm, {
        "unset": state({
            getCalibrationFunc: function (userData) {
                // this *is* the reference client
                referenceCalibrationReading = userData;

                // Move to the other state
                fsm.state("set");

                // just create a passthrough
                return UserCalibrator.passthrough;
            }
        }),
        "set": state({
            getCalibrationFunc: function (userData) {
                // Want the calibration ref data from reference user        
                // Now we have the data, Return the calibration function
                if (referenceCalibrationReading) {
                    return UserCalibrator.calibrate(
                        referenceCalibrationReading,
                        userData
                    );
                } else {
                    // Must go to the 'unset' state
                    fsm.state("unset");

                    // Call the other version of this function
                    return fsm.getCalibrationFunc(userData);
                }
            }
        })
    };
};
