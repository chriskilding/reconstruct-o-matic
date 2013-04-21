/*jslint node: true */
"use strict";

// Basic mock for Redis' list functionality
// given that https://github.com/faeldt/redis-mock
// does not yet support this

function noDataForKey(callback) {
    callback("no data for this key", null);
}

function RedisListMock() {
    this.storage = {};
}

// Not an official method!
RedisListMock.prototype.getTopic = function (key, callback) {
    var topic = this.storage[key];
    
    if (topic === null) {
        return callback("no key called that", null);
    } else {
        return topic;
    }
};

// Not an official method!
RedisListMock.prototype.initTopic = function (key) {
    var topic = this.storage[key];
    
    if (topic === null || topic === undefined) {
        // make the topic if does not already exist
        topic = [];
    }
    
    return topic;
};

RedisListMock.prototype.llen = function (key) {
    var topic = this.storage[key];
    
    if (topic) {
        return topic.length;
    } else {
        return 0;
    }
};

RedisListMock.prototype.rpush = function (key, values) {
    // Insert all values at tail end of key
    var topic = this.initTopic(key);
    
    topic.push(values);
    
    console.log("topic", this.storage[key]);
};

RedisListMock.prototype.lpop = function (key) {
    // remove and return first elem in list
    var topic = this.initTopic(key);
    
    return topic.splice(0, 1);
};

RedisListMock.prototype.del = function (keys) {
    keys.forEach(function (key) {
        var topic = this.storage[key];

        // Key is IGNORED if not in DB
        // does NOT trigger creation of a topic
        if (topic) {
            topic = [];
        }
    });
};

RedisListMock.prototype.lindex = function (key, index, callback) {
    var topic = this.getTopic(key, callback);
    
    var data = topic[index];
    
    if (data === null) {
        return noDataForKey(callback);
    }
    
    // If was valid key and have data, good to go
    callback(null, data);
};

// topic, 0, -1, function (err, reply) {
RedisListMock.prototype.lrange = function (key, start, stop, callback) {
    var topic = this.getTopic(key, callback);
    
    // lrange returns last item INCLUSIVE
    var data = topic.slice(start, stop + 1);
    
    if (data === null) {
        return noDataForKey(callback);
    }
    
    // If was valid key and have data, good to go
    callback(null, data);
};

function createClient() {
    return new RedisListMock();
}

exports.createClient = createClient;