/*
 * Definition of a socket.io 'room' entity.
 * You will use these in the rooms creation callback.
 */

var Signal = require('js-signals');

function Room(server, id) {
    this.server = server;
    this.id = id;

    // Events object
    // it is a nested 'on' in line
    // with the Dart DOM Events API recommendations.
    this.on = {
        close: new Signal(),
        message: new Signal(),
        join: new Signal(),
        leave: new Signal()
    };
}


/*
 * Broadcast messages to the Room's Sockets.
 */
Room.prototype.emit = function (eventName, data) {
    // Delegate to the 'broadcast to sockets in room' method
    // which already exists.
    this.server.sockets.in(this.id).emit(eventName, data);
};

/*
 * Socket joins.
 */ 
Room.prototype.onjoin = function (socket) {
    this.on.join.dispatch(socket);
};

/*
 * Socket leaves.
 */ 
Room.prototype.onleave = function (socket) {
    this.on.leave.dispatch(socket);
};

/*
 * All sockets left, or room otherwise closed.
 */ 
Room.prototype.onclose = function () {
    this.on.close.dispatch();
};

/*
 * Export the room.
 */
module.exports = exports = Room;

