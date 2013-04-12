/*jslint node: true */
"use strict";

var skeletonAggregator = require('./SkeletonAggregator');

// Overall user position
function reduceOverallUserPosition(a, b, index, array) {
    var returner = a;
    
    if (b.positionTracked) {
        returner.position = b.position;
        returner.positionTracked = true;
    }
    
    return returner;
}

function reconstructUser(users) {
	switch (users.length) {
    case 0:
        return {};
    case 1:
        // Only one sensor was rigged up anyway
        return users[0];
    default:
        // Just the skeletons
        var skeletons = users.map(function (value, index, array) {
            return value.skeleton;
        });
        
        // Does everything but skeleton
        var returner = users.reduce(reduceOverallUserPosition);
        
        returner.skeleton = skeletonAggregator.reconstructSkeleton(skeletons);
                    
        return returner;
	}
}

exports.reconstructUser = reconstructUser;