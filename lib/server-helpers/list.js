// In-memory store which mimics the queue structure of Redis
// allows for swappable backends.

// DB should act like a JS object i.e. {}
module.exports = function (db) {
    // Private function just handles existence checking
    var getValueAt = function (key, callback) {
        var value = db[key];

        if (value) {
            return value;
        }
        else {
            callback("That key does not exist", null); 
        }
    };

    var ensureKeyExists = function (key) {
        var exists = (db[key] !== null);
        
        if (!exists) {
            db[key] = [];
        }
    };

    return {
        llen: function (key, callback) {
            var list = getValueAt(key, callback);

            if (list) {
                callback(null, list.length);
            }
        },

        lrange: function (key, start, stop, callback) {
            var list = getValueAt(key, callback);

            if (list) {
                // Array.slice returns shallow copy
                var sublist = list.slice(start, stop);

                callback(null, sublist);
            }
        },

        del: function () {
            for (var i = 0; i < arguments.length; ++i) {
                var key = arguments[i];
                delete db[key];
            }
        },

        lpush: function (key, data) {
            ensureKeyExists(key);
            db[key].splice(0, 0, data);
        },

        lpop: function (key, callback) {
           var list = getValueAt(key, callback);

           if (list) {
                callback(null, list.splice(0, 1);
           }
        },

        // Insert all the specified values at the tail of the list stored at key.
        // If key does not exist, it is created as empty list before performing the push operation.
        // When key holds a value that is not a list, an error is returned.
        rpush: function (key, data) {
            ensureKeyExists(key);
            db[key].push(data);
        },

        // Removes and returns the last element of the list stored at key.
        rpop: function (key, callback) {
            // Simple - Array.prototype.pop goes to last elem
            var list = getValueAt(key, callback);

            if (list) {
                callback(null, list.pop());
            }
        }
    };
};
