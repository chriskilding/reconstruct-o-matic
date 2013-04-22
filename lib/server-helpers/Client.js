/*jslint node: true */
"use strict";

var Signal = require("signals");

// A client signed up to a particular skeleton
function Client(id, skeleton) {
    this.id = id;
    this.skeleton = skeleton;
    this.calibrateFunc = undefined;
    this.vent = {
        finishWindow: new Signal()
    };
}

Client.prototype.joinSkeleton = function (skeleton) {
    this.skeleton = skeleton;
};
  
Client.prototype.leaveSkeleton = function () {
    // Break the skeleton's link to this client
    // if it's joined up to one
    if (this.skeleton) {
        this.skeleton.removeClient(this);
        // Break this client's link to the skeleton
        this.skeleton = undefined;
    }
};

Client.prototype.calibrate = function (calibrationData) {
    // Don't attempt to run unless client linked to a skeleton
    if (this.skeleton) {
        this.calibrateFunc = this.skeleton.getCalibrationFunc(calibrationData, this);
    }
};

Client.prototype.pushRealData = function (data) {
    // Don't attempt to run unless client linked to a skeleton
    if (this.skeleton) {
        if (this.calibrateFunc) {
            // Prep the data
            var latestRealReading = this.calibrateFunc(data);
            // Then hand it to the skeleton
            this.skeleton.pushRealData(data, this);
        } else {
            this.calibrate(data);
        }
    }
};

Client.prototype.finishWindowCallback = function (reconstructed) {
    // We got us a skeleton, now emit it to all the listeners
    this.vent.finishWindow.dispatch(reconstructed);
};

module.exports = Client;