/*jslint node: true */
"use strict";

// Node server which gets OpenNI data from clients and combines it
console.log("Starting up...");

// Uses the socket.io server component (debug output suppressed)
var io = require('socket.io').listen(3000, { log: false });

// Ensure Redis is cleaned on startup
require('redis').createClient(6379, 'localhost').flushall();

var SyncedClient = require('./lib/SyncedClient').type;

function isReference(roomId, clientSocketId) {
    return io.sockets.clients(roomId)[0].id === clientSocketId;
}

io.sockets.on('connection', function (socket) {
    // We need some way to uniquely identify each client
    // socket.io client id is the socket.id - that'll do
    var syncedClient = new SyncedClient(socket.id, isReference);
    
    // Received calibration data from client
    socket.on('calibrate', function (data) {
        syncedClient.calibrate(data);
    });
    
    // Received 'real' data from a client
    socket.on('request', function (data) {
        syncedClient.pushRealData(data, function (roomId, reconstructed) {
            // And tell the room about it
            // INCLUDING THE CLIENT THAT SENT THE DATA
            io.sockets.in(roomId).emit('response', reconstructed);
        });
    });
    
    // Client setting its 'sharing code' to team up with another  
    socket.on('subscribe', function (roomId) {
        console.log('client joined room', roomId);
        socket.join(roomId);
        syncedClient.joinRoom(roomId);
    });
    
    socket.on('unsubscribe', function (roomId) {
        socket.leave(roomId);
        syncedClient.leaveRoom(roomId);
    });
    
    socket.on('disconnect', function () {
        console.log('User disconnected: ' + socket.id);
        syncedClient.terminate();
    });
});