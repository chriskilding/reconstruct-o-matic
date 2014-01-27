/**
 * Stores position deltas for 2ndary clients.
 */
module.exports = function (redis) {
    return {
        set: function (key, pos) {
            // FIXME node-redis can take a JS object
            // so don't need to input x, y, z separately.
            redis.hmset(key, 
                        "x", pos.x,
                        "y", pos.y,
                        "z", pos.z);
        },
        
        get: function (key, callback) {
            redis.hgetall(key, function (err, keyvalues) {
                var data = null;

                if (keyvalues) {
                    // This comes out looking like ["x", 3, "y", 2]
                    // so we need to make it look like a hash again.
                    data = {
                        x: keyvalues[1],
                        y: keyvalues[3],
                        z: keyvalues[5]
                    };
                }

                callback(err, data);
            });
        }
    };               
};
