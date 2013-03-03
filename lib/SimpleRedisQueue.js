// Keep forgetting which way round you set up your Redis queue?
// Forget about it and use this simple queue instead!

var redis = require('redis');

function create() {
  var db = redis.createClient(6379, 'localhost');
  
  return {
    push: function (topic, data) {
	  db.rpush(topic, data);
	},
	
	pop: function (topic) {
      db.lpop(topic);
	},

	clear: function (topic) {
	  // Clear out the list
	  db.ltrim(topic, 0, -1);
	},

	head: function (topic) {
	  return db.lindex(topic, 0);
	},

	tail: function (topic) {
	  return db.lrange(topic, 1, -1);
	},

	all: function (topic) {
	  return db.lrange(topic, 0, -1);
	},
	
	length: function(topic) {
	  return db.llen(topic);
	}
  };
}

exports.create = create;