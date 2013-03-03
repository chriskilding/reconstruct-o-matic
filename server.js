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
  
  // Received calibration data from client
  socket.on('calibrate', function(data) {
    socket.rooms.forEach(function(roomId) {
  
	  var combinedSkeleton = SyncedSkeleton.pushCalibrate(roomId, data);
	  
	  if (combinedSkeleton) {
	    .emit(
	  }
  });
    
  // Received 'real' data from a client
  socket.on('request', function(data) {
    socket.rooms.forEach(function(roomId) {
	  var combinedSkeleton = SyncedSkeleton.push(roomId, clientId, data);
	  
	  // Needs to go to everyone in the common session
	  // INCLUDING THE CLIENT THAT SENT THE DATA
	  if (combinedSkeleton) {
	    io.sockets.in(roomId).emit('response', combinedSkeleton);
	  }
	});
  });
  
  // Client setting its 'sharing code' to team up with another  
  socket.on('subscribe', function(data) {
    socket.join(data.room);
    SyncedSkeleton.addClientToGroup(data.room, clientId);
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