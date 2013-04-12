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

// This gets called every time real data comes from client
// to stop JS from creating a new instance of the function on every push
// (which would eat up memory fast!)
// this has been extracted out into a single named function
function broadcastFinalSkeleton(roomId, reconstructed) {
    // And tell the room about it
    // INCLUDING THE CLIENT THAT SENT THE DATA
    io.sockets.in(roomId).emit('response', reconstructed);
}

io.sockets.on('connection', function (socket) {
    // We need some way to uniquely identify each client
    // socket.io client id is the socket.id - that'll do
    var syncedClient = new SyncedClient(socket.id, isReference);
    
    // Received 'real' data from a client
    var onreq = function (data) {
        syncedClient.pushRealData(data, broadcastFinalSkeleton);
    };
    
    // Received calibration data from client
    var oncalibrate = function (data) {
        console.log('calibrating', socket.id);
        syncedClient.calibrate(data);
    };
    
    // Client setting its 'sharing code' to team up with another  
    var onsub = function (roomId) {
        console.log('client joined room', roomId);
        socket.join(roomId);
        syncedClient.joinRoom(roomId);
    };
    
    // Client leaving 1 room (but not totally disconnecting)
    var onunsub = function (roomId) {
        console.log('leaving room', roomId);
        socket.leave(roomId);
        syncedClient.leaveRoom(roomId);
    };
    
    var ondisconn = function () {
        console.log('User disconnected: ' + this.clientId);
        syncedClient.terminate();
    };
    
    socket.on('calibrate', oncalibrate);
    
    socket.on('request', onreq);
    
    socket.on('subscribe', onsub);
    
    socket.on('unsubscribe', onunsub);
    
    socket.on('disconnect', ondisconn);
});