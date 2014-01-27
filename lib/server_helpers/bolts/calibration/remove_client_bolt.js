/*jslint node: true */
"use strict";

module.exports = function (clientsProvider) {
	this.process = function (tuple, collector) {    

		// 1. Destructure.
		var roomkey           = tuple.roomkey,
			inputClient       = tuple.inputClient,
			isReference       = tuple.isReference;
				   	
		if (isReference) {
	
			// The ref client has bailed out!
			// FIXME Recalibration required.
			clientsProvider.unsetReference(roomkey, client, function (err, success) {
				collector.emit({});
			});
		} else {
	
			// Is a secondary client
			// Just remove its bits
			clientsProvider.unsetSecondary(roomkey, client);
		}
	};
};


