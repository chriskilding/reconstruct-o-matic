/*jslint node: true */
"use strict";

// Node server which gets OpenNI data from clients and combines it
// using socket.io as a transport
exports.init = function () {
    var Client = require("./lib/server-helpers/Client");
    var ClientSkeletonManager = require("./lib/server-helpers/ClientSkeletonManager");

    // Uses the socket.io server component (debug output suppressed)
    var io = require("socket.io").listen(3000, { log: false });
    
    // One manager per app
    var manager = new ClientSkeletonManager();
        
    io.sockets.on("connection", function (socket) {
        console.log("client connected", socket.id);
        
        // We need some way to uniquely identify each client
        // (don't know what the skeleton ID is at this time
        // so leave it blank)
        var syncedClient = new Client(socket.id, null);
        
        // Bind the windowFinishCallback
        syncedClient.vent.finishWindow.add(function (reconstructed) {
            socket.emit("response", reconstructed);
        });
                                      
        // Received 'real' data from a client
        var onreq = function (data) {
            syncedClient.pushRealData(data);
        };
        
        // Received calibration data from client
        var oncalibrate = function (data) {
            console.log("calibrating", socket.id);
            syncedClient.calibrate(data);
        };
        
        // Client setting its 'sharing code' to team up with another  
        var onsub = function (skeletonId) {
            console.log("client joining a session", skeletonId);
            manager.joinSkeleton(syncedClient, skeletonId);
        };
        
        // Client leaving or disconnecting
        var onexit = function () {
            console.log("Client leaving", socket.id);
            syncedClient.leaveSkeleton();
        };
        
        socket.on("calibrate", oncalibrate);
        
        socket.on("request", onreq);
        
        socket.on("subscribe", onsub);
        
        socket.on("unsubscribe", onexit);
        
        socket.on("disconnect", onexit);
    });
};