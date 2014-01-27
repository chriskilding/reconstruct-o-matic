/*jslint node: true */
"use strict";

module.exports = function (clientReadings) {
	this.process = function (tuple, collector) {
        
		// Destructure
		var roomkey          = tuple.roomkey,
			referenceClient  = tuple.referenceClient;
	

		// Fetch latest reading of existing reference client.
		clientReadings.get(referenceClient, function (err, referenceReading) {
			collector.emit({
				referenceReading: referenceReading
			});
		});

    };
};
