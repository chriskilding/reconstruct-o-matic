/**
 * A simple Redis key-value based getter and setter.
 */
module.exports = function (redis) {
    return {
        get: function (key, callback) {
            redis.get(key, callback);
        },
        set: function (key, data) {
            redis.set(key, data);
        }
    };
};
