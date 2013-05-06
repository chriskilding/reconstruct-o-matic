/*jslint node: true */
"use strict";

var SkeletonAggregator = require("./SkeletonAggregator");
var _ = require("underscore");

// Arrays only
function reduceUsers(users) {
    // Weed out the user readings that failed to track even any part
    // of the skeleton, or the user's overall position
    var filtered = _.chain(users)
        .filter(function (user) {
            return (user.positionTracked === true) && (user.skeletonTracked === true);
        })
        .pluck("skeleton")
        .value();
    
    var preOut = {
        // Take first user values for these components
        id: users[0].id,
        position: users[0].position,
        // Well it better be by now...
        positionTracked: true,
        skeletonTracked: true,
        // Just reduce the skeletons
        skeleton: SkeletonAggregator.reconstructSkeleton(filtered)
    };
    
    return preOut;
}

function condenseUser(users) {
    // Got an array of users - apply reduce
    if (users instanceof Array) {
        return reduceUsers(users);
    } else {
        // If only one sensor was rigged up anyway
        // Do NOT call reduce(), it will crash
        return users;
    }
}

exports.condenseUser = condenseUser;
exports.reduceUsers = reduceUsers;