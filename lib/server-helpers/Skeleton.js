/*jslint node: true */
"use strict";

var UserAggregator = require("../UserAggregator");
var SkeletonCalibrator = require("../SkeletonCalibrator");

// A skeleton shared by a number of clients
// who contribute data to reconstruct it
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
    
    if (result) {
        this.clients.forEach(function (client) {
            client.finishWindowCallback(result);
        });
    }
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
    this.clients = this.clients.filter(function (cli) {
        return cli.id !== client.id;
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
    // If there are no clients connected yet
    // the client is the first one in
    // and so must also be a reference client
    return (this.referenceClient.id === client.id) || (this.clients.length === 0);
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