// Node server which gets OpenNI data from clients and combines it
console.log("Starting up...");

// Uses the socket.io server component (debug output suppressed)
var io = require('socket.io').listen(3000/*, { log: false }*/);
var wrap = require('wrappers');

var SyncedSkeleton = require('./SyncedSkeleton');

io.sockets.on('connection', function (socket) {  
  // We need some way to uniquely identify each client
  // socket.io client id is the socket.id - that'll do
  var clientId = socket.id;       
  
  // Received from a client
  socket.on('data', function(data) {
    var combinedSkeleton = SyncedSkeleton.push(data.commonSessionId, clientId, data.skeleton);
    
    // TODO needs to go to everyone in the common session
    if (combinedSkeleton) {
      socket.emit('combinedSkeleton', combinedSkeleton);
    }
  });
  
  // Client setting its 'sharing code' to team up with another
  socket.on('meta', function(data) {
    SyncedSkeleton.addClientToGroup(data.commonSessionId, clientId);    
  });
  
  socket.on('disconnect', function() {    
    console.log('User disconnected: ' + clientId);  
  });
});