/*jslint node: true */
"use strict";

// Keep forgetting which way round you set up your Redis queue?
// Forget about it and use this simple queue instead!
// Remember, the Redis commands that *get* state below are ASYNC!
var redis = require('redis');
var async = require('async');

function create(index) {
    var db = redis.createClient(6379, 'localhost');
    
    if (index) {
        db.select(index);
    }
  
    return {
		push: function (topic, data) {
			db.rpush(topic, JSON.stringify(data));
		},
	
		pop: function (topic, callback) {
			db.lpop(topic, function (err, reply) {
                callback(reply);
            });
		},

		clear: function (topic) {
			// Clear out the list
			db.del(topic);
		},

		at: function (topic, index, callback) {
            db.lindex(topic, index, function (err, reply) {
                callback(JSON.parse(reply));
            });
		},

        first: function (topic, callback) {
			at(topic, 0, callback);
		},
        
		last: function (topic, callback) {
			at(topic, -1, callback);
		},

		all: function (topic, outerCallback) {
			db.lrange(topic, 0, -1, function (err, reply) {
			  // Do this in parallel
				async.map(
					reply,
					function (item, callback) {
						callback(null, JSON.parse(item));
					},
					function (err, results) {
						// results is now an array of reinflated JSON objects
						outerCallback(results);
					}
				);
            });
		},
	
		length: function (topic) {
			return db.llen(topic);
		}
    };
}

exports.create = create;