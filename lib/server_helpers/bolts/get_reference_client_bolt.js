/*jslint node: true */
"use strict";

/**
 * This just retrieves the reference client
 * for a room.
 *
 * @param referenceClients Persistence store mapping rooms to reference clients.
 */
module.exports = function (referenceClients) {
	this.process = function (tuple, collector) {
		// Destructure
		var	roomkey     = tuple.roomkey;
	
		referenceClients.get(roomkey, function (err, client) {
			collector.emit({
				referenceClient: client
			});
		});
	};
};
