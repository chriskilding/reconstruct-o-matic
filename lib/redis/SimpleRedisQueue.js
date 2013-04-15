/*jslint node: true */
"use strict";

// Keep forgetting which way round you set up your Redis queue?
// Forget about it and use this simple queue instead!
// Remember, the Redis commands that *get* state below are ASYNC!
var redis = require('redis');
var _ = require('underscore');
var RedisHelpers = require("./RedisQueueHelpers");


function create(index) {
    var db = redis.createClient(6379, 'localhost');
    
    if (index) {
        db.select(index);
    }
  
    // Use underscore's partial application
    // to automatically pass the db we just made
    // to these functions
    // each time they are called
    return {
		push: _.partial(RedisHelpers.push, db),
		pop: _.partial(RedisHelpers.pop, db),
		clear: _.partial(RedisHelpers.clear, db),
		at: _.partial(RedisHelpers.at, db),
        first: _.partial(RedisHelpers.first, db),
		last: _.partial(RedisHelpers.last, db),
		all: _.partial(RedisHelpers.all, db),
		length: _.partial(RedisHelpers.length, db)
    };
}

exports.create = create;