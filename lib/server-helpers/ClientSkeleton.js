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
    this.referenceClient = undefined;
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
    
    if (!this.referenceClient) {
        this.referenceClient = client;
    }
    
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
    delete this.clients[clientId];
};

// Perform push, and call the clients back
ClientSkeleton.prototype.onRealData = function (client, data) {
    var result = this.pushReal(client, data);
    if (result) {
        _(this.clients).forEach(function (client) {
            client.finishWindowCallback(result);
        });
    }
};

// Just the push, no calling clients back
ClientSkeleton.prototype.pushReal = function (client, data) {
    this.skeleton.pushRealData(data);
    if (this.isReferenceClient(client)) {
        // finish the window and return the result
        return this.skeleton.finishWindow();
    }
};

ClientSkeleton.prototype.isReferenceClient = function (client) {
    // if the client is the first one in
    // it must also be a reference client
    return (this.referenceClient === client) || (this.clients.length <= 1);
};

ClientSkeleton.prototype.getCalibrationFunc = function (client, userData) {
    if (this.isReferenceClient(client)) {
        return this.skeleton.getReferenceCalibrationFunc(userData);
    } else {
        return this.skeleton.getSecondaryCalibrationFunc(userData);
    }
};

module.exports = ClientSkeleton;