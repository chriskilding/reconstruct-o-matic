/*jslint node: true */
"use strict";

// Functional-ish methods for the skeleton
var UserAggregator = require("../UserAggregator");
var SkeletonCalibrator = require("../SkeletonCalibrator");
var _ = require("underscore");

function Skeleton() {
    this.realReadings = [];
    this.referenceCalibrationReading = undefined;
    this.clients = [];
}

Skeleton.prototype.finishWindow = function () {
    // Retrieve all the readings
    var result = UserAggregator.condenseUser(this.realReadings);
        
    // Clear out the data
    this.realReadings.length = 0;
    
    return result;
};

Skeleton.prototype.pushRealData = function (data, client) {
    this.realReadings.push(data);
    
    if (this.isReferenceClient(client)) {
        // finish the window and return the result
        return this.finishWindow();
    }
};

Skeleton.prototype.addClient = function (client) {
    this.clients.push(client);
};

Skeleton.prototype.removeClient = function (client) {
    this.clients = _.reject(this.clients, function (cli) {
        return cli.id === client.id;
    });
    
    // If ref client gone
    // we'll need to recalibrate
    if (this.isReferenceClient(client)) {
        this.referenceCalibrationReading = undefined;
    }
};

Skeleton.prototype.referenceClient = function () {
    return this.clients[0];
};

Skeleton.prototype.isReferenceClient = function (client) {
    return this.referenceClient.id === client.id;
};

Skeleton.prototype.getCalibrationFunc = function (userData, client) {
    if (this.isReferenceClient(client)) {
        // this *is* the reference client
        // just create a passthrough
        this.referenceCalibrationReading = userData;
        return SkeletonCalibrator.passthrough;
    } else {
        // Want the calibration ref data from reference user        
        // Now we have the data, Return the calibration function
        return SkeletonCalibrator.calibrate(
            this.referenceCalibrationReading.skeleton,
            userData.skeleton
        );
    }
};

module.exports = Skeleton;