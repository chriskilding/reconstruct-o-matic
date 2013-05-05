/*jslint node: true */
"use strict";

var Client = require("./Client");
var Skeleton = require("./Skeleton");
var _ = require("underscore");

// Maps skeletons to clients feeding them with data
function ClientSkeleton() {
    this.skeleton = new Skeleton();
    // Associates a client ID to a client object
    this.clients = {};
}

// Adds a new client to the 'room'
// and returns a handle to it
ClientSkeleton.prototype.addClient = function (clientId) {
    var client = new Client();
    
    client.vent.calibrate.add(_.bind(function (data, callback) {
        var func = this.getCalibrationFunc(client, data);
        callback(func);
    }, this));
    
    client.vent.realData.add(_.bind(function (data) {
        this.onRealData(client, data);
    }, this));
    
    client.vent.terminate.add(_.bind(function () {
        this.removeClient(clientId);
    }, this));
    
    this.clients[clientId] = client;
    
    return client;
};

ClientSkeleton.prototype.removeClient = function (clientId) {
    var theClient = this.clients[clientId];
    
    // If ref client gone
    // we'll need to recalibrate
    if (this.isReferenceClient(theClient)) {
        this.referenceCalibrationReading = undefined;
    }
    
    // Null it out
    this.clients[clientId] = undefined;
};

ClientSkeleton.prototype.referenceClient = function () {
    return this.clients[0];
};

ClientSkeleton.prototype.onRealData = function (client, data) {
    this.skeleton.pushRealData(data);
    if (this.isReferenceClient(client)) {
        // finish the window and return the result
        var result = this.skeleton.finishWindow();
        if (result) {
            this.clients.forEach(function (client) {
                client.vent.finishWindow.dispatch(result);
            });
        }
    }
};

ClientSkeleton.prototype.isReferenceClient = function (client) {
    // if the client is the first one in
    // it must also be a reference client
    return (this.referenceClient() === client) || (this.clients.length <= 1);
};

ClientSkeleton.prototype.getCalibrationFunc = function (client, userData) {
    if (this.isReferenceClient(client)) {
        return this.skeleton.getReferenceCalibrationFunc(userData);
    } else {
        return this.skeleton.getSecondaryCalibrationFunc(userData);
    }
};

ClientSkeleton.prototype.pushRealData = function (data) {
    // Don't attempt to run unless client linked to a skeleton
    if (this.calibrateFunc) {
        // Prep the data
        var latestRealReading = this.calibrateFunc(data);
        // Then hand it to the skeleton
        this.skeleton.pushRealData(data, this);
    } else {
        this.calibrate(data);
    }
};


module.exports = ClientSkeleton;