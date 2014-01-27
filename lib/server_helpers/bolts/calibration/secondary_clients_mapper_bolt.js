/*jslint node: true */
"use strict";

var _ = require("underscore");

module.exports = function (clientsProvider) {
	this.process = function (tuple, collector) {    

		// 1. Destructure.
		var roomkey           = tuple.roomkey;
	
		// Trigger recalibration of other clients
		// this happens whether or not this client was the reference
		clientsProvider.getSecondary(roomkey, function (err, clients) {
			// A bit of parallelism
			_.each(clients, function (client) {
				collector.emit({
					secondaryClient: client
				});
			});
		});
	};		
    	
};


