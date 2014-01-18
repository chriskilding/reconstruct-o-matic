/*jslint node: true */
"use strict";

var io = require("socket.io");
var _ = require("underscore");
var Signal = require("signals");

var CalibrationTopology = require("./lib/server_helpers/calibration_topology");
var ReconstructionTopology = require("./lib/server_helpers/reconstruction_topology");
var SocketioSource = require("./lib/server_helpers/spouts/socketio_source");

// Node server which gets OpenNI data from clients and combines it
// using socket.io as a transport
exports.init = function () {    
    // Uses the socket.io server component (debug output suppressed)
    var ioserver = io.listen(
        process.env.port || 3000,
        { log: false }
    );

	var signals = {
		calibrationSent: new Signal(),
		readingSent: new Signal()
	};
	
	var db = {};
		
	// Bind the socketio callback function to its dependencies
	var callback = _.partial(SocketioSource.callback, 
							 ioserver,
							 signals.calibrationSent,
							 signals.readingSent);
	
	// Create and start the topologies
	CalibrationTopology(db, signals.calibrationSent).start();
	ReconstructionTopology(db, ioserver, signals.readingSent).start();
	
	// Start the data source
    ioserver.sockets.on("connection", callback);
};