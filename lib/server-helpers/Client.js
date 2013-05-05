/*jslint node: true */
"use strict";

var Signal = require("signals");
var _ = require("underscore");

// A client signed up to a particular skeleton
function Client() {
    this.calibrateFunc = undefined;
    this.vent = {
        finishWindow: new Signal(),
        terminate: new Signal(),
        realData: new Signal(),
        calibrate: new Signal()
    };
}

Client.prototype.calibrate = function (calibrationData) {
    this.vent.calibrate.dispatch(calibrationData, _.bind(function (calibrateFunc) {
        this.calibrateFunc = calibrateFunc;
    }, this));
};

Client.prototype.pushRealData = function (data) {
    if (this.calibrateFunc) {
        // Prep the data
        var latestRealReading = this.calibrateFunc(data);
        // Then hand it onwards (to the skeleton)
        this.vent.realData.dispatch(data);
    } else {
        this.calibrate(data);
    }
};

Client.prototype.terminate = function () {
    this.vent.terminate.dispatch();
};

Client.prototype.finishWindowCallback = function (reconstructed) {
    // We got us a skeleton, now emit it to all the listeners
    this.vent.finishWindow.dispatch(reconstructed);
};

module.exports = Client;