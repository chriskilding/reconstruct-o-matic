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

ClientSkeleton.prototype.removeClient = function (clientId) {
    var theClient = this.clients[clientId];
    
    var isRef = this.isReferenceClient(theClient);
    
    // Null it out
    delete this.clients[clientId];
        
    // If ref client gone
    // we'll need a new one
    // but don't have to change the skeleton's ref calibration reading
    // or update the calibration functions of any 2ndary sensors
    if (isRef) {
        this.referenceClient = _(this.clients).find(function (client) {
            // If it's not null (i.e. it's truthy)
            // return it
            if (client) {
                return true;
            } else {
                return false;
            }
        });
    }
};


ClientSkeleton.prototype.getCalibrationFunc = function (client, userData) {
    if (this.isReferenceClient(client)) {
        return this.skeleton.getReferenceCalibrationFunc(userData);
    } else {
        return this.skeleton.getSecondaryCalibrationFunc(userData);
    }
};

module.exports = ClientSkeleton;