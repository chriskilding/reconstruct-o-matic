/*jslint node: true */
"use strict";

var SkeletonAggregator = require("./SkeletonAggregator");
var _ = require("underscore");

// Overall user position
// Note, confidence values are not supplied with this
// and as no overall user rotation data is supplied
// no reconstruction can be done
// IT IS BEST TO NOT USE THIS!
/*function reduceOverallUserPosition(a, b, index, array) {
    if (b.positionTracked) {
        return {
            position: b.position,
            positionTracked: true
        };
    } else {
        return {
            position: a.position,
            positionTracked: a.positionTracked
        };
    }
}*/

// Arrays only
function reduceUsers(users) {
    var preOut = _.chain(users)
        // Weed out the user readings that failed to track even any part
        // of the skeleton, or the user's overall position
        .filter(function (user) {
            return (user.positionTracked === true) && (user.skeletonTracked === true);
        })
        .tap(function (intermediates) {
            return {
                // Well it better be by now...
                positionTracked: true,
                skeletonTracked: true,
                // Just reduce the skeletons
                skeleton: SkeletonAggregator.reconstructSkeleton(_.pluck(intermediates, "skeleton"))
            };
        })
        .value();
    
    if (preOut) {
        // An array with a single value here
        // doesn't just transform into a single object
        // you have to extract and return the first (and only)
        // element manually
        return preOut[0];
    }
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