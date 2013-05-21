/*jslint node: true */
"use strict";

// Node server which gets OpenNI data from clients and combines it
// using socket.io as a transport
exports.init = function () {
    var ClientSkeletonManager = require("./lib/server-helpers/ClientSkeletonManager");

    // Logger
    // Is attached to console by default
    var winston = require("winston");
    
    if (process.env.loggly_inputToken) {
        console.info("adding SaaS logger");
        
        winston.add(require("winston-loggly").Loggly, {
            subdomain: process.env.loggly_subdomain,
            inputToken: process.env.loggly_inputToken,
            json: true
        });
    }
    
    // Uses the socket.io server component (debug output suppressed)
    var io = require("socket.io").listen(
        process.env.port || 3000,
        { log: false }
    );
    
    // One manager per app
    var manager = new ClientSkeletonManager();
        
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
        socket.on("request", function (data) {
            if (syncedClient) {
                syncedClient.pushRealData(data);
            } else {
                // If not connected to any skeleton
                // just reflect the data
                socket.emit("response", data);
            }
        });
        
        // Client setting its 'sharing code' to team up with others
        socket.on("subscribe", function (skeletonId) {
            console.info("Client", socket.id, "joining a session", skeletonId);
            
            syncedClient = manager.joinSkeleton(socket.id, skeletonId);
            
            // Only now there is a syncedClient 
            // do we bind the windowFinishCallback
            syncedClient.vent.finishWindow.add(function (reconstructed) {
                socket.emit("response", reconstructed);
            });
        });
        
        socket.on("unsubscribe", onexit);
        
        socket.on("disconnect", onexit);
    });
};