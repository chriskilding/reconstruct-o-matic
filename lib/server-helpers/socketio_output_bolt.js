/**
 * Returns results to all concerned socket.io clients
 * participating in a shared room.
 */
module.exports.execute = function (io, tuple, collector) {
    // Destructure the tuple
    var reconstruction = tuple.reconstruction,
        roomkey        = tuple.roomkey;
       
    // Emit only to clients in the room 
    io.sockets.in(roomkey).emit("response", reconstruction);
};

