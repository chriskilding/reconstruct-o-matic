var UserAggregator = require("../UserAggregator");

/**
 * Gets a bunch of skeletons and combines them.
 */
module.exports.execute = function (tuple, collector) {
    // Destructure the tuple
    var skeletons = tuple.skeletons,
        roomkey   = tuple.roomkey;
    
    // Compute the final skeleton
    var result = UserAggregator.condenseUser(skeletons);

    collector.emit({
        reconstruction: result,
        roomkey: roomkey
    });
};

