// Node server which gets OpenNI data from clients and combines it
console.log("Starting up...");

// Uses the socket.io server component (debug output suppressed)
var io = require('socket.io').listen(3000, { log: false });
var _ = require('underscore');

// Ensure Redis is cleaned on startup
require('redis').createClient(6379, 'localhost').flushall();

var SyncedSkeleton = require('./lib/SyncedSkeleton');

io.sockets.on('connection', function (socket) {  
  // We need some way to uniquely identify each client
  // socket.io client id is the socket.id - that'll do
  var clientId = socket.id;       
  
  // The data conversion function that will be applied
  // if this is a secondary sensor
  // defaults to a simple passthrough func at the start
  var calibrationFunc = function (data) {return data;};
  
  // Shortcut to the rooms this client is in
  var rooms = [];
  
  // Received calibration data from client
  socket.on('calibrate', function(data) {
		rooms.forEach(function(roomId) {
			if (isReference(roomId, socket)) {
				console.log('Reference data for ', roomId);

				SyncedSkeleton.setReferencePoint(roomId, data);
			}
			else {
				SyncedSkeleton.getCalibrationFunc(roomId, data, function(result) {
				  calibrationFunc = result;
				});
			}
		});

  });
    
  // Received 'real' data from a client
  socket.on('request', function(data) {
		rooms.forEach(function(roomId) {
	
			if (isReference(roomId, socket)) {
				// Came from a primary sensor
				SyncedSkeleton.pushReal(roomId, data);
	
				// Aaaaand finish the window
				SyncedSkeleton.finishWindow(roomId, function(reconstructed) {
					// And tell the room about it
					// INCLUDING THE CLIENT THAT SENT THE DATA
					if (reconstructed) {
					  console.log('reconstructed data', reconstructed);

						io.sockets.in(roomId).emit('response', reconstructed);
					}
				});
			}
			else {
				// Convert data before pushing
				// (it probably came from a secondary sensor)
				SyncedSkeleton.pushReal(roomId, calibrationFunc(data));
			}
	
		});
  });
  
  // Client setting its 'sharing code' to team up with another  
  socket.on('subscribe', function(roomId) {
  	console.log('client joined room', roomId);
    socket.join(roomId);
    rooms.push(roomId);
  });

  socket.on('unsubscribe', function(roomId) {
    socket.leave(roomId);
    
    // Also strip that value from the 'shortcut' list
    rooms = _.filter(rooms, function(str) {
    	return str != roomId;
    });
    
    SyncedSkeleton.clear(roomId);
  });
  
  socket.on('disconnect', function() {    
    console.log('User disconnected: ' + clientId);
    
    rooms.forEach(function(roomId) {
      SyncedSkeleton.clear(roomId);
    }); 
  });
});

function isReference(roomId, clientSocket) {
  return io.sockets.clients(roomId)[0].id == clientSocket.id;
}