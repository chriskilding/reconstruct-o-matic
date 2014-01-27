/**
 * Stores rotation deltas for 2ndary clients.
 */
module.exports = function (redis) {
    return {
        set: function (key, rot) {
            redis.multi()
                // Start by clearing the list
                .ltrim(key, 1, 0)
                // Then populate it
                .rpush(key,
                       rot[0], rot[1], rot[2],
                       rot[3], rot[4], rot[5],
                       rot[6], rot[7], rot[8])
                .exec();
        },

        get: function (key, callback) {
            // Getting ALL the things
            redis.lrange(key, 0, -1, callback);
        }
    };               
};
