/*jslint node: true */
"use strict";

var _ = require('underscore');

var SyncedSkeleton = require('./SyncedSkeleton');

function SyncedClient(clientId, isReferenceFunc) {
    this.clientId = clientId;
    
    // The data conversion function that will be applied
    // if this is a secondary sensor
    // defaults to a simple passthrough func at the start
    this.calibrationFunc = function (data) {
        return data;
    };
    
    // Shortcut to the rooms this client is in
    this.rooms = [];
    
    this.isReference = isReferenceFunc;
}

SyncedClient.prototype.calibrate = function (data) {
	var that = this;
  
    // Go through the rooms this client is in
    this.rooms.forEach(function (roomId) {
        // Is it the reference client for this room?
		if (that.isReference(roomId, that.clientId)) {
			console.log('Reference data for ', roomId);
            // If yes, set the reference point in that room
			SyncedSkeleton.setReferencePoint(roomId, data);
		} else {
            // If not, it needs an (updated) calibration function
            // to convert its data to present it as though
            // the data was captured by the reference client
			SyncedSkeleton.getCalibrationFunc(roomId, data, function (result) {
                that.calibrationFunc = result;
			});
		}
	});
};

SyncedClient.prototype.pushRealData = function (data, windowFinishCallback) {
	var that = this;
  
    this.rooms.forEach(function (roomId) {
		if (that.isReference(roomId, this.clientId)) {
			// Came from a primary sensor
			SyncedSkeleton.pushReal(roomId, data);

			// Aaaaand finish the window
			SyncedSkeleton.finishWindow(roomId, function (reconstructed) {
				// If we got a valid reconstructed skeleton back
                // dish it out to the callback
                // which typically is used to broadcast the reconstruction
                // back to the clients in the room
                if (reconstructed) {
                    windowFinishCallback(roomId, reconstructed);
				}
			});
		} else {
			// Convert data before pushing
			// (it probably came from a secondary sensor)
			SyncedSkeleton.pushReal(roomId, this.calibrationFunc(data));
		}

	});
};

SyncedClient.prototype.joinRoom = function (roomId) {
    this.rooms.push(roomId);
};

SyncedClient.prototype.leaveRoom = function (roomId) {
    // Also strip that value from the 'shortcut' list
    this.rooms = _.filter(this.rooms, function (str) {
        return str !== roomId;
    });
    
    // If the reference user has left,
    // clean out the room
    if (this.isReference(roomId, this.clientId)) {
        SyncedSkeleton.clear(roomId);
    }
};

// Any extra cleanup
SyncedClient.prototype.terminate = function () {
    this.rooms.forEach(function (roomId) {
        SyncedSkeleton.clear(roomId);
    });
};

exports.type = SyncedClient;