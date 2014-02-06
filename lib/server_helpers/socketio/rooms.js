var Signal = require('js-signals');
var Room = require('./room');
/*
 * The overall io.rooms object which sits on io
 * and the user can talk to.
 */
function Rooms(server) {
    this.on = {
        open: new Signal()
    };

    this.server = server;
}
   
/*
 * Room did not exist before and must be created
 */ 
Rooms.prototype.oncreate = function (id) {
    var room = new Room(this.server, id);

    this.on.open.dispatch(room);
};

// FIXME will have to modify socketio/lib/adapter.js add, del, delAll methods
// see https://github.com/LearnBoost/socket.io/blob/master/lib/adapter.js

module.exports = exports = Rooms;
