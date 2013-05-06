/*jslint node: true */
"use strict";

var Fixtures = require("./Fixtures");
var sinon = require("sinon");
var _ = require("underscore");

var manager;

var skel1 = "skel123";

var client1 = "abc123";
var client2 = "gef456";

QUnit.module("ClientSkeletonManager", {
    setup: function () {
        manager = new ClientSkeletonManager();
    },
    teardown: function () {
        manager = null;
    }
});

test("CSM - basic config checks", 1, function (assert) {
    assert.deepEqual(Object.keys(manager.rooms), [], true);
});

test("joinSkeleton - add 1 client", 2, function (assert) {
    var returned = manager.joinSkeleton(client1, skel1);
    
    // Don't forget, manager.rooms[index] contains a ClientSkeleton
    // NOT a Client
    // Need to index into it to find the client!!
    var added = manager.rooms[skel1].clients[client1];
        
    // The specified client is in the collection
    assert.deepEqual(added, returned, true);
    
    // One ClientSkeleton session is in the collection
    assert.equal(Object.keys(manager.rooms).length, 1, true);
    
});

test("joinSkeleton - add 2 clients, same session", 4, function (assert) {
    var c1 = manager.joinSkeleton(client1, skel1);
    var c2 = manager.joinSkeleton(client2, skel1);
    
    // Don't forget, manager.rooms[index] contains a ClientSkeleton
    // NOT a Client
    // Need to index into it to find the client!!
    var actual = manager.rooms[skel1].clients;
        
    // c1 is in the collection
    assert.deepEqual(actual[client1], c1, true);
    // c2 is in the collection
    assert.deepEqual(actual[client2], c2, true);
    
    // One ClientSkeleton session is in the collection
    assert.equal(Object.keys(manager.rooms).length, 1, true);
    
    // Two clients are registered
    assert.equal(Object.keys(actual).length, 2, true);
});