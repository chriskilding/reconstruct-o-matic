// Abstraction that sits on top of a list structure
// and limits to simple push/pop.

// var list = require("./list");

module.exports = function (db) {
    // The db is injected as a sort of service
    // so we can be flexible as to the exact data store used.
    
    return {
        push: function (key, data) {
            // Add at the back
            db.rpush(key, data);
        },

        pop: function (key, callback) {
            // Take off the front
            db.lpop(key, callback);
        },

        clear: function (key) {
            // Fastest way to clear the list is to delete the key
            db.del(key);
        },

        all: function (key, callback) {
            db.lrange(key, 0, -1, callback);
        },

        length: function (key, callback) {
            db.llen(key, callback);
        }
    };
};
