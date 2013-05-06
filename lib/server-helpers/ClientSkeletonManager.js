/*jslint node: true */
"use strict";

var ClientSkeleton = require("./ClientSkeleton");

function ClientSkeletonManager() {
    // Associative array
    // looks like
    // {
    //      'myskel': [ClientSkeleton],
    //      'jimbobtheskel': [ClientSkeleton]
    // }
    this.rooms = {};
}

// At this point, an API user knows the ID of the skeleton they want
// but do not have an instance handle to it
ClientSkeletonManager.prototype.joinSkeleton = function (clientId, roomId) {
    if (!this.rooms[roomId]) {
        // Make a new one
        // Do not cache result of rooms[roomId] in a var
        // and modify the var
        // because you'll overwrite the var instead of adding the new instance
        this.rooms[roomId] = new ClientSkeleton();
    }
    
    // Create and connect the client
    // return a handle to it
    return this.rooms[roomId].addClient(clientId);
    
};

module.exports = ClientSkeletonManager;