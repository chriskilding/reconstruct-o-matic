/*jslint node: true */
"use strict";

var async = require("async");

function push(db, topic, data) {
    db.rpush(topic, JSON.stringify(data));
}

function pop(db, topic, callback) {
    db.lpop(topic, function (err, reply) {
        callback(reply);
    });
}

function clear(db, topic) {
    // Clear out the list
    db.del(topic);
}

function at(db, topic, index, callback) {
    db.lindex(topic, index, function (err, reply) {
        callback(JSON.parse(reply));
    });
}

function first(db, topic, callback) {
    at(topic, 0, callback);
}

function last(topic, callback) {
    at(topic, -1, callback);
}

function all(db, topic, outerCallback) {
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
}

function length(db, topic) {
    return db.llen(topic);
}

exports.length = length;
exports.all = all;
exports.first = first;
exports.last = last;
exports.at = at;
exports.clear = clear;
exports.pop = pop;
exports.push = push;