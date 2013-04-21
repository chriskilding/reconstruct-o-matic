/*jslint node: true */
"use strict";

var Skeleton = require("./Skeleton");

function ClientSkeletonManager() {
    // Associative array
    // looks like
    // {
    //      'myskel': [Skeleton],
    //      'jimbobtheskel': [Skeleton]
    // }
    this.skeletons = {};
}

// At this point, an API user knows the ID of the skeleton they want
// but do not have an instance handle to it
ClientSkeletonManager.prototype.joinSkeleton = function (client, skeletonId) {
    var skeleton = this.skeletons[skeletonId];
    
    if (!skeleton) {
        // Make a new one
        skeleton = new Skeleton();
    }
    
    client.joinSkeleton(skeleton);
};

module.exports = ClientSkeletonManager;