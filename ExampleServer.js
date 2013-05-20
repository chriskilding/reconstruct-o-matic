/*jslint node: true */
"use strict";

// Node server which gets OpenNI data from clients and combines it
// using socket.io as a transport
exports.init = function () {
    var ClientSkeletonManager = require("./lib/server-helpers/ClientSkeletonManager");

    // Logger
    var winston = require("winston");

    if (process.env.loggly_inputToken) {
        winston.add(require("winston-loggly").Loggly, {
            subdomain: process.env.loggly_subdomain,
            inputToken: process.env.loggly_inputToken,
            json: true
        });
        
        winston.info("switching to SaaS logger");
    }
    
    // Uses the socket.io server component (debug output suppressed)
    var io = require("socket.io").listen(
        process.env.port || 3000,
        { log: false }
    );
    
    // One manager per app
    var manager = new ClientSkeletonManager();
        
    io.sockets.on("connection", function (socket) {
        winston.info("client connected", {
            "clientId": socket.id
        });
        
        // We need some way to uniquely identify each client
        // (don't know what the skeleton ID is at this time
        // so leave it blank)
        var syncedClient;
        
        // Client leaving or disconnecting
        var onexit = function () {
            winston.info("Client leaving", {
                clientId: socket.id
            });
            
            if (syncedClient) {
                syncedClient.terminate();
            }
        };
        
        // Received calibration data from client
        socket.on("calibrate", function (data) {
            winston.info("Client calibrating", {
                "clientId": socket.id
            });
            
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
            winston.info("Client joining a session", {
                "clientId": socket.id,
                "sessionId": skeletonId
            });
            
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