/*jslint node: true */
"use strict";

var _ = require("underscore");

/**
 * socketio server injected as dependency.
 * This is the io.sockets.on("connection") function callback.
 * io dependency must be shared with the socketio output bolt to work.
 */
module.exports.connect = function (socket, io, calibrationCollector, readingCollector) {        
    console.info("client connected", socket.id);

    // Shorthand to get the first room a client is in
    // Disposes of the "" global room, because we don't want that.
    var getRoomKey = function () {
        return _.chain(io.sockets.manager.roomClients[socket.id])
                .without("")
                .first()
                .value();
    };

    // Shared between the calibration and request methods
    // since they happen to do pretty much the same thing.
    // Collector should be bound before use with partial application.
    var emit = function (collector, data) {
        var roomkey = getRoomKey();

        if (roomkey) {
            collector.emit({
                user:    data,
                client:  socket.id,
                roomkey: roomkey 
            });
        }
    };    

    // Received calibration data from client
    socket.on("calibrate", _.partial(emit, calibrationCollector));

    // Received 'real' data from a client
    socket.on("request", _.partial(emit, readingCollector));

    // Client setting its 'sharing code' to team up with others
    socket.on("subscribe", function (data) {
        console.info("Client", socket.id, "joining a session", data.room);
        
        // Leave the existing room - may only be in one at a time
        socket.leave(getRoomKey());
        
        // Now join the new one
        socket.join(data.room);
    });

    socket.on("unsubscribe", function (data) {
        socket.leave(data.room);   
    });

    socket.on("disconnect", function () {
        console.info("Client disconnecting", socket.id);   
    });
};
