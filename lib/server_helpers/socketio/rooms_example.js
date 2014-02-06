// Example of how we would use rooms

var io = {};

// Note, you can't access the global default room "/".
// This is only for named rooms that are created afterwards.
io.rooms.on.open.add(function (room) {
    

    console.log("The room ID is:", room.id);

    console.log("The clients are", room.clients);

    room.on.join.add(function (socket) {
        console.log("A client joined", socket.id);
    });

    room.on.leave.add(function (socket) {
        console.log("A client left the room", socket.id);
    });

    /*
     * Just like socket.on("message")
     * this is a callback for when someone does
     * socket.send(foo) - the simplest type of sending.
     */
    room.on.message.add(function (socket, eventName, data) {
        // Trivial example - broadcast back to all sockets
        room.emit(eventName, data);
    });

    room.on.close.add(function () {
        // Clean up
    });
});
