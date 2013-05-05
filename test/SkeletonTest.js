/*jslint node: true */
"use strict";

var Fixtures = require("./Fixtures");
var sinon = require("sinon");

 var skeleton;

QUnit.module("Skeleton", {
    setup: function () {
        skeleton = new Skeleton();
    },
    teardown: function () {
        skeleton = null;
    }
});

test("skeleton - basic config checks", 1, function (assert) {
    assert.equal(skeleton.referenceClient(), null, true);
});

test("addClient - add anything, goes in", 1, function (assert) {
    skeleton.addClient({});
    assert.equal(skeleton.clients.length, 1, true);
});
