/*jslint node: true */
"use strict";

var Fixtures = require("./Fixtures");
var sinon = require("sinon");
var _ = require("underscore");

var room;

var clientId = "abc123";

QUnit.module("ClientSkeleton", {
    setup: function () {
        room = new ClientSkeleton();
    },
    teardown: function () {
        room = null;
    }
});

test("CS - basic config checks", 1, function (assert) {
    assert.deepEqual(Object.keys(room.clients), [], true);
});

test("addClient - add 1 client", 1, function (assert) {
    var returned = room.addClient(clientId);
    
    var actual = room.clients[clientId];
    
    // Something was added
    assert.equal(actual, returned, true);
});

test("terminate - remove 1 client", 1, function (assert) {
    var removeMethod = sinon.spy(room, "removeClient");
    
    var theClient = room.addClient(clientId);
    
    // Remove it
    theClient.terminate();
    
    var actual = room.clients[clientId];
    
    // The client was actually removed
    assert.ok(removeMethod.calledWith(clientId), true);
});