/*jslint node: true */
"use strict";

/**
 * Takes in a new reading
 * if it comes from a secondary sensor, stockpile it
 * if it comes from reference sensor, finish + emit all data from this window.
 */
module.exports.execute = function (db, tuple, collector) {

    // First destructure the tuple
    var user        = tuple.user,
        isReference = tuple.isReference,
        roomkey     = tuple.roomkey;
    	
    // Perform push
    db.rpush(roomkey, user);

    if (isReference) {
        // Window finished
        db.lrange(roomkey, 0, -1, function (err, users) {
            // Clear the list
            db.ltrim(roomkey, 0, -1);
            
            // Emit skeletons
            collector.emit({
                users: users
            });
        });
   }
};
