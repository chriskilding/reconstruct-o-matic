/*jslint node: true */
"use strict";

var Fixtures = require("./Fixtures");
var sinon = require("sinon");
var _ = require("underscore");

var room;

var client1 = "abc123";
var client2 = "gef456";

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

test("addClient - add 1 client", 2, function (assert) {
    var returned = room.addClient(client1);
    
    var actual = room.clients[client1];
    
    // Something was added
    assert.equal(actual, returned, true);
    // It is now the reference client
    assert.ok(room.isReferenceClient(returned), true);
});

test("removeClient - remove 1 client", 1, function (assert) {
    var removeMethod = sinon.spy(room, "removeClient");
    
    var theClient = room.addClient(client1);
    
    // Remove it
    theClient.terminate();
    
    var actual = room.clients[client1];
    
    // The client was actually removed
    assert.ok(removeMethod.calledWith(client1), true);
});

test("add 2 clients - remove 1 - still work?", 2, function (assert) {    
    var c1 = room.addClient(client1);
    var c2 = room.addClient(client2);
    
    var finishSpy = sinon.spy(c1, "finishWindowCallback");
    
    // c1 pushes once to calibrate some data
    c1.pushRealData(Fixtures.realUser);
    
    // Remove second one
    c2.terminate();
    
    // again for the real thing
    c1.pushRealData(Fixtures.realUser);
    
    // c1 called with *something*
    assert.ok(finishSpy.called, true);
    
    // c1 still gets its data back
    // server did not crash
    assert.ok(finishSpy.calledWith(Fixtures.realUser), true);
});

test("referenceClient - with no clients", 1, function (assert) {
    // There are no clients yet
    assert.ok(!room.referenceClient, true);
});

test("isReferenceClient - with 1 client", 1, function (assert) {
    var addedClient = room.addClient(client1);
    
    var actual = room.isReferenceClient(addedClient);
    
    // 1st client in is the ref client
    assert.ok(actual, true);
});

test("isReferenceClient - with 2 clients", 1, function (assert) {
    // For a change, add the second one first
    var c2 = room.addClient(client2);
    var c1 = room.addClient(client1);
    
    var actual = room.isReferenceClient(c2);
    
    // client2 is the ref client
    assert.ok(actual, true);
});

// Can a client stream back to itself?
test("getCalibrationFunc - with 1 client", 1, function (assert) {
    var c1 = room.addClient(client1);
    
    var funcSpy = sinon.spy(room, 'getCalibrationFunc');

    c1.calibrate(Fixtures.realUser);
    
    assert.ok(funcSpy.calledWith(c1, Fixtures.realUser), true);    
});

// Can a client stream back to itself?
test("pushReal - with 1 client", 2, function (assert) {
    var c1 = room.addClient(client1);
    c1.calibrate(Fixtures.realUser);
    
    var pushRealSpy = sinon.spy(room, 'pushReal');
    var finishSpy = sinon.spy(c1, 'finishWindowCallback');
    
    // Yes, I used the same value again...
    var result = c1.pushRealData(Fixtures.realUser);
    
    // Did it hit the clientskeleton
    assert.ok(pushRealSpy.calledWith(c1, Fixtures.realUser), true);    
        
    // Did the result get back to c1
    assert.ok(finishSpy.called, true);
});

// 1 client with a sensor, and 1 viewer
test("pushReal - 1 client, 1 viewer", 3, function (assert) {
    var c1 = room.addClient(client1);
    var c2 = room.addClient(client2);
    
    // Only c1 needs to calibrate
    c1.calibrate(Fixtures.realUser);
    
    var pushRealSpy = sinon.spy(room, 'pushReal');
    var finish1Spy = sinon.spy(c1, 'finishWindowCallback');
    var finish2Spy = sinon.spy(c2, 'finishWindowCallback');
    
    // Yes, I used the same value again...
    var result = c1.pushRealData(Fixtures.realUser);
    
    // Did it hit the clientskeleton
    assert.ok(pushRealSpy.calledWith(c1, Fixtures.realUser), true);    
        
    // Did the result get back to c1
    assert.ok(finish1Spy.called, true);
    // and c2??
    assert.ok(finish2Spy.called, true);
});