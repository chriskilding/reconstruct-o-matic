/*jslint node: true */
"use strict";

var clientUtils = require("../client_utilities");

module.exports = function (clientsProvider) {
	this.process = function (tuple, collector) {    

		// 1. Destructure.
		var roomkey           = tuple.roomkey,
			inputClient       = tuple.inputClient,
			referenceClient   = tuple.referenceClient;
	   	
		if (clientUtils.isReference(referenceClient, inputClient)) {
	
			// The ref client has arrived.
			// Set the ref ID on the room.
			// Note, must not call callback before set completes
			// to ensure the persistence store actually got it.
			clientsProvider.setReference(roomkey, client, function (err, success) {
				collector.emit({});
			});
		} else {
	
			// Is a secondary client
			clientsProvider.setSecondary(roomkey, client, function (err, success) {
				collector.emit({});
			});
		}
	};
};


