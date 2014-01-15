/*jslint node: true */
"use strict";

/**
 * The processor does not know any details about its clients
 * a separate manager module handles wiring up reference vs secondary clients.
 * The processor just receives input
 * and, when ready, spits out reconstructions.
 *
 * @param wires This must look like { input: { reference: [Signal], secondary: [Signal] }, output: [Signal] }.
 * @param skeletonFsm the FSM to control the skeletonQueue, usually a {}.
 */
module.exports.execute = function (db, tuple, collector) {

    // First destructure the tuple
    var skeleton    = tuple.skeleton,
        isReference = tuple.isReference,
        roomkey     = tuple.roomkey

    	
    // Perform push
    db.rpush(roomkey, skeleton);

    if (isReference) {
        // Window finished
        db.lrange(roomkey, 0, -1, function (err, skeletons) {
            // Clear the list
            db.ltrim(roomkey, 0, -1);
            
            // Emit skeletons
            collector.emit({
                roomkey: roomkey,
                skeletons: skeletons
            });
        });
   }
};
