/*jslint node: true */
"use strict";

/**
 * socketio server injected as dependency.
 * This is a PUSH based spout; it is event driven.
 * Needs to be shared with the socketio output bolt to work.
 */
module.exports.open = function (io, collector) {        
	io.sockets.on("connection", function (socket) {
		console.info("client connected", socket.id);
	
		// We need some way to uniquely identify each client
		// (don't know what the skeleton ID is at this time
		// so leave it blank)
		var syncedClient;
	
		// Client leaving or disconnecting
		var onexit = function () {
			console.info("Client leaving", socket.id);
		
			if (syncedClient) {
				syncedClient.terminate();
			}
		};
	
		// Received calibration data from client
		socket.on("calibrate", function (data) {
			console.info("Client calibrating", socket.id);
		
			if (syncedClient) {
				syncedClient.calibrate(data);
			}
		});
	
		// Received 'real' data from a client
		// Emit to the output collector
		socket.on("request", function (data) {
			collector.emit({
				user:    data,
				roomkey: ???
			});
		});
	
		// Client setting its 'sharing code' to team up with others
		socket.on("subscribe", function (skeletonId) {
			console.info("Client", socket.id, "joining a session", skeletonId);
		
			syncedClient = manager.joinSkeleton(socket.id, skeletonId);
		});
	
		socket.on("unsubscribe", onexit);
	
		socket.on("disconnect", onexit);
	});

};