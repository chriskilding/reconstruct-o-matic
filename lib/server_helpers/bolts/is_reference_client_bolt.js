/*jslint node: true */
"use strict";

var clientUtils = require("./client_utilities");

/**
 * This passes on a boolean indicating whether
 * a client is the reference for a room.
 *
 * @param referenceClients Persistence store mapping rooms to reference clients.
 */
module.exports = function (referenceClients) {
	this.process = function (tuple, collector) {
		// Destructure
		var	referenceClient = tuple.referenceClient,
			inputClient     = tuple.inputClient;
	
		if (clientUtils.isReference(referenceClient, inputClient)) {
			collector.emit({
				isReference: true
			});
		} else {
			collector.emit({
				isReference: false
			});
		}
	};
};
