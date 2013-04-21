/*jslint node: true */
"use strict";

// Get Redis config
var nconf = require('nconf');
nconf.env();

// Connect to Redis
var redis = redis.createClient(nconf.get("REDIS_PORT"), nconf.get("REDIS_HOST"));
redis.auth(nconf.get("REDIS_PASSWORD"));

// Create an nohm and connect it to Redis
var nohm = require('nohm').Nohm;
nohm.setClient(redis);

function load() {
    return nohm;
}

exports.load = load;