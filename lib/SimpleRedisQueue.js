// Keep forgetting which way round you set up your Redis queue?
// Forget about it and use this simple queue instead!
// Remember, the Redis commands that *get* state below are ASYNC!
var redis = require('redis');

function create(index) {
  var db = redis.createClient(6379, 'localhost');
  
  if (index) {
    db.select(index);
  }
  
  return {
		push: function (topic, data) {
			db.rpush(topic, data);
		},
	
		pop: function (topic, callback) {
			db.lpop(topic, function(err, reply) {
        callback(reply);
    	});
		},

		clear: function (topic) {
			// Clear out the list
			//console.log("clearing");
			//db.ltrim(topic, 0, -1);
			db.del(topic);
		},

		first: function (topic, callback) {
			return db.lindex(topic, 0, function(err, reply) {
        callback(reply);
    	});
		},

		last: function (topic, callback) {
			return db.lindex(topic, -1, function(err, reply) {
        callback(reply);
    	});
		},

		all: function (topic, callback) {
			return db.lrange(topic, 0, -1, function(err, reply) {
        callback(reply);
    	});
		},
	
		length: function(topic) {
			return db.llen(topic);
		}
  };
}

exports.create = create;