/*jslint node: true */
"use strict";

var SkeletonCalibrator = require("../SkeletonCalibrator");

// A client signed up to a particular skeleton
function Client(id, skeleton) {
    this.id = id;
    this.skeleton = skeleton;
    this.calibrateFunc = undefined;
}

Client.prototype.joinSkeleton = function (skeleton) {
    this.skeleton = skeleton;
};
  
Client.prototype.leaveSkeleton = function () {
    this.skeleton = undefined;
};

Client.prototype.calibrate = function (calibrationData) {
    this.calibrateFunc = SkeletonCalibrator.calibrate(
        // the reference data
        this.skeleton.referenceCalibrationReading,
        // this client's data
        calibrationData
    );
};

Client.prototype.pushRealData = function (data) {
    if (this.calibrateFunc) {
        // Prep the data
        var latestRealReading = this.calibrateFunc(data);
        // Then hand it to the skeleton
        this.skeleton.pushRealData(data, this);
    } else {
        this.calibrate(data);
    }
};

Client.prototype.finishWindowCallback = function (reconstructed) {
    // TODO we got us a skeleton... now what?
};

module.exports = Client;