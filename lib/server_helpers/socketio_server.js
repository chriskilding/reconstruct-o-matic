/*jslint node: true */

var _ = require("underscore"),
    UserAggregator = require("../UserAggregator"),
    UserCalibrator = require("../UserCalibrator"),
    SkeletonCalibrator = require("../SkeletonCalibrator");


// If I had native 'rooms' support, this might be how I would do the server... 
// io.rooms.on("create", the exported function below);
module.exports = exports = function (room) {

	console.log("This room was created", room.id);

	// TODO `room.owner` semantics for talking about which socket 'owns' the room
    // this can be auto set initially.
	console.log("The owner is", room.owner);

    // Associative array
    // { 'some socket id': { user reading } }
    // Ensures only 1 reading per socket at a time.
    var readings = {};

    // {
    //     'some socket id': {
    //         position: { x: 0, y: 1, z: 2 },
    //         rotation: [0, 0, 0, 1, 1, 1, -1, -1, -1]
    //     }
    // }
    var deltas = {};

    // This is not recalibration of one client
    // but a request for recalibration of ALL clients
    // perhaps because the readings are poor.
    // FIXME must call this after new client added and pushed data
    var calibrate = function () {
        // First need a reference reading
        var reference = readings[room.owner.id];

        if (reference) {
            _.chain(room.clients)
                .reject(function (socket) {
                    return socket.id === room.owner.id;        
                })
                .each(function (socket) {
                    // Get latest reading.
                    var latest = readings[socket.id];

                    if (latest) {
                        // Calibrate.
                        var delta = SkeletonCalibrator.calibrateSkeleton(reference.skeleton, latest.skeleton);
                        
                        // Store it.
                        if (delta) {
                            deltas[socket.id] = delta;
                        }
                    }
                });
        }
    };

    // Calibration can be manually triggered.
    room.on("calibrate", calibrate);

	room.on("join", function (socket) {
        // tell all sockets in the room that a new socket joined
        room.emit("ohai", socket.id);
	});

	room.on("leave", function (socket) {
        // TODO update the owner 
        
        // Start recalibrating with new owner set.
        calibrate();
	});

	room.on("destroy", function () {
        console.log("Room destroyed", room.id);
	});

    // What to do when a reading is received.
	room.on("reading", function (socket, data) {
        
        // Store it.
        readings[socket.id] = data;

        // Finish window if it was the owner.
        if (socket.id === room.owner.id) {

            var transformedReadings = _.chain(readings)
                .map(function (reading, socketId) {
                    var delta = deltas[socketId];

                    if (socketId === room.owner.id) {
                        // Do not transform.
                        return reading;
                    }
                    else if (delta) {
                        // Transform.
                        return UserCalibrator.reconstructUserAsObject(reading, delta.position, delta.rotation);
                    } else {
                        // This is not the room owner
                        // but it does not have a transformation.
                        // IGNORE IT.
                        return null;
                    }
                })
                // Strip any nulls.
                .compact()
                // And finish.
                .value();    

            // Send off readings for reducing.
            var result = UserAggregator.condenseUser(transformedReadings);    

            // Clear the readings.
            readings = {};

            // Emit the result.
            room.emit("reconstruction", result);
        }
	});

});
