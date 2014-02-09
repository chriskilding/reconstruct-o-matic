// Example of how we would use rooms

var io = {};

// Note, you can't access the global default room "/".
// This is only for named rooms that are created afterwards.
io.rooms.on("create", function (room) {

	// ID should be available
	console.log("This room was created", room.id);

	// TODO `room.owner` semantics for talking about which socket 'owns' the room
	// this could logically be set to the socket that first creates the room,
	// but updating this when the original owner leaves could be quite specific to
	// the needs (and authorisation / user roles functionality) of each application
	// that uses socket.io.
	console.log("The owner is", room.owner);


	// Instance variable belonging to a room can just be set in the callback.
	//
	// TODO this should probably plug in to the socket.io persistence store
	// to let the programmer use room.set(); and room.get();
	// but I don't know enough about that to build it just yet.
	var someSharedVar = "foo";

	room.on("join", function (socket) {
	  // tell all sockets in the room that a new socket joined
	  room.emit("ohai", socket.id);
	});

	room.on("leave", function (socket) {
	  // a socket left
	});

	// Room cleanup automatically fires when the standard
	// socket.io room manager decides a room should die.
	room.on("destroy", function () {
	  // A callback in case the application programmer
	  // wants to do something when the room is destroyed
	});

	room.on("some custom socket event", function (socket, data) {
	  // Whenever a socket receives data through a non-reserved event
	  // it will be passed on to each room it is in
	  // through a callback like this.

	  // The socket object is included in this callback so we know whodunnit.
	});

	// Access to sockets in the room should feel natural too
	room.clients.forEach(function (socket) {
	  console.log("this is one of the clients", socket.id);
	});

});