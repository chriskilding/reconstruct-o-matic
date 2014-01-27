/*jslint node: true */
"use strict";

module.exports = function (clientReadings) {
	this.process = function (tuple, collector) {
        
		// Destructure
		var roomkey          = tuple.roomkey,
			secondaryClient  = tuple.secondaryClient;
	

		// Fetch latest reading of new secondary client
		clientReadings.get(client, function (err, secondaryReading) {
				
			collector.emit({
				secondaryReading: secondaryReading
			});
		});

    };
};
