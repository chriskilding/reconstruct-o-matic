/*jslint node: true */
"use strict";

// Node server which gets OpenNI data from clients and combines it
// using socket.io as a transport
exports.init = function () {
    // Uses the socket.io server component (debug output suppressed)
    var io = require('socket.io').listen(3000, { log: false });
    
    var Client = require('./Client');
        
    io.sockets.on('connection', function (socket) {
        // We need some way to uniquely identify each client
        var syncedClient = new Client(socket.id, ???????);
        
        // Bind the windowFinishCallback
        syncedClient.vent.finishWindow.add(function (reconstructed) {
            socket.emit("response", reconstructed);
        });
                                      
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
            syncedClient.joinSkeleton(????);
        };
        
        // Client leaving or disconnecting
        var onexit = function () {
            console.log('Client leaving: ', socket.id);
            syncedClient.leaveSkeleton();
        };
        
        socket.on('calibrate', oncalibrate);
        
        socket.on('request', onreq);
        
        socket.on('subscribe', onsub);
        
        socket.on('unsubscribe', onexit);
        
        socket.on('disconnect', onexit);
    });
};