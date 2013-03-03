// Node server which gets OpenNI data from clients and combines it
console.log("Starting up...");

// Uses the socket.io server component (debug output suppressed)
var io = require('socket.io').listen(3000 /*, { log: false }*/);
var wrap = require('wrappers');

var SyncedSkeleton = require('lib/SyncedSkeleton');

io.sockets.on('connection', function (socket) {  
  // We need some way to uniquely identify each client
  // socket.io client id is the socket.id - that'll do
  var clientId = socket.id;       
  
  // The data conversion function that will be applied
  // if this is a secondary sensor
  var calibrationFunc = {};
  
  // Received calibration data from client
  socket.on('calibrate', function(data) {
    socket.rooms.forEach(function(roomId) {
  
    // Add the calibration data
    calibrationFunc = SyncedSkeleton.pushCalibrate(roomId, data);
  });
    
  // Received 'real' data from a client
  socket.on('request', function(data) {
    socket.rooms.forEach(function(roomId) {
        
      if (isReference(roomId, socket)) {
        // Came from a primary sensor
        SyncedSkeleton.pushReal(roomId, data);
        
        // Aaaaand finish the window
        var reconstructed = SyncedSkeleton.finishWindow(roomId);
        
        // And tell the room about it
	    // INCLUDING THE CLIENT THAT SENT THE DATA
        io.sockets.in(roomId).emit('response', reconstructed);
      }
      else {
        // Convert data before pushing
        // (it probably came from a secondary sensor)
        SyncedSkeleton.pushReal(roomId, calibrationFunc(data));
      }
      
      
      
	});
  });
  
  // Client setting its 'sharing code' to team up with another  
  socket.on('subscribe', function(data) {
    socket.join(data.room);
  });

  socket.on('unsubscribe', function(data) {
    socket.leave(data.room);
  });
  
  socket.on('disconnect', function() {    
    console.log('User disconnected: ' + clientId);  
  });
});

function isReference(roomId, clientSocket) {
  return io.sockets.clients(roomId)[0] == clientSocket;
}