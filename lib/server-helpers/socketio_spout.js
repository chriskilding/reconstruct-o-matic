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
	
		// Client leaving or disconnecting
		var onexit = function () {
			console.info("Client leaving", socket.id);
	
            socket.get("roomkey", function (err, roomkey) {
                if (roomkey) {
                    syncedClient.terminate();
                }
            });
		};
	
		// Received calibration data from client
		socket.on("calibrate", function (data) {
			console.info("Client calibrating", socket.id);
	
            socket.get("roomkey", function (err, roomkey) {
                if (roomkey) {
                    syncedClient.calibrate(data);
                }
            });
		});
	
		// Received 'real' data from a client
		// Emit to the output collector
		socket.on("request", function (data) {
			
            socket.get("roomkey", function (err, roomkey) {
                if (roomkey) {
                    collector.emit({
                        user:    data,
                        roomkey: roomkey 
                    });
			});
		});
	
		// Client setting its 'sharing code' to team up with others
		socket.on("subscribe", function (skeletonId) {
			console.info("Client", socket.id, "joining a session", skeletonId);
	
            socket.set("roomkey", skeletonId);
		});
	
		socket.on("unsubscribe", onexit);
	
		socket.on("disconnect", onexit);
	});

};
