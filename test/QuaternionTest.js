/*jslint node: true */
"use strict";

// Adapted from the Three.js unit tests for the same module

/**
 * @author bhouston / http://exocortex.com
 */

QUnit.module("Quaternion");

var closetest = require("./utilities/close");

var orders = [ 'XYZ', 'YXZ', 'ZXY', 'ZYX', 'YZX', 'XZY' ];
var eulerAngles = {
    x: 0.1,
    y: -0.3,
    z: 0.25
};
var x = 2;
var y = 3;
var z = 4;
var w = 5;



/*var qSub = function ( a, b ) {
	var result = Quaternion.create(a);
	result.copy( a );

	result.x -= b.x;
	result.y -= b.y;
	result.z -= b.z;
	result.w -= b.w;

	return result;

};*/

test("create - no args", 4, function (assert) {
	var a = Quaternion.create();
	assert.equal(a.x, 0, true);
	assert.equal(a.y, 0, true);
	assert.equal(a.z, 0, true);
	assert.equal(a.w, 1, true);
});

test("create - with args", 4, function (assert) {
	var a = Quaternion.create(x, y, z, w);
	assert.equal(a.x, x, true);
	assert.equal(a.y, y, true);
	assert.equal(a.z, z, true);
	assert.equal(a.w, w, true);
});

test("createFromAxisAngle", function (assert) {

	// TODO: find cases to validate.
  
	var zero = Quaternion.create();

	var a = Quaternion.createFromAxisAngle({x: 1, y: 0, z: 0}, 0),
        b = Quaternion.createFromAxisAngle({x: 0, y: 1, z: 0}, 0),
        c = Quaternion.createFromAxisAngle({x: 0, y: 0, z: 1}, 0),
        a1 = Quaternion.createFromAxisAngle({x: 1, y: 0, z: 0}, Math.PI),
        a2 = Quaternion.createFromAxisAngle({x: 1, y: 0, z: 0}, -Math.PI),
        mult = Quaternion.multiply(a1, a2);

    assert.ok(Quaternion.equals(a, zero), true);
	assert.ok(Quaternion.equals(b, zero), true);
	assert.ok(Quaternion.equals(c, zero), true);
	assert.ok(!Quaternion.equals(a, a1), true);
	assert.ok(!Quaternion.equals(a, a2), true);
	assert.ok(Quaternion.equals(a, mult), true);
});

test("to and from rotation matrix", function (assert) {
    var mat = Fixtures.real4x4;
    
    var quat = Quaternion.createFromRotationMatrix(mat);
    
    var back = Quaternion.quaternionToMatrix(quat);
    
    closetest.arrayClose(back, Fixtures.real3x3, Fixtures.maxDifference, true);
  
});

// Sometimes zig.js throws out rotation matrices with 9 zeroes in them
// so what happens then?
// FIXME correct this test
test("createFromRotationMatrix - all zeroes", 1, function (assert) {
    var actual = Quaternion.quaternionToMatrix(Quaternion.createFromRotationMatrix(Fixtures.zeroes4x4));
    assert.deepEqual(actual, Fixtures.real4x4, true);
});

// This steps through the low level maths
// behind one of the RotationCalibrator's functions
test("multiply - apply a quaternion of no change", 1, function (assert) {
    // a real example once gave
    // { x: -1.5612511283791264e-17, y: 0, z: 0, w: 0.9999999621423682 }
    // which is nigh on...
    var delta = { x: 0, y: 0, z: 0, w: 1 };
    
    // adapt the real 4x4 data to a quaternion
    var quat1 = Quaternion.createFromRotationMatrix(Fixtures.real4x4);
    
    // multiply the quaternions to yield the transformation
    var mult = Quaternion.multiply(quat1, delta);
    
    // finally turn back into a 3x3 matrix
    var out = Quaternion.quaternionToMatrix(mult);
    
    // The adjusted matrix should be no different to the original!
    // (Floating point errors excepted)
    closetest.arrayClose(out, Fixtures.real3x3, Fixtures.maxDifference, true);
});

/*test( "createFromEuler", function() {
	// ensure euler conversion for Quaternion matches that of Matrix4
  orders.forEach(function (order, index, array) {
		var q = Quaternion.createFromEuler(eulerAngles, order);
		var m = new THREE.Matrix4().setRotationFromEuler( eulerAngles, order);
		var q2 = new THREE.Quaternion().setFromRotationMatrix( m );

		ok( qSub( q, q2 ).length() < 0.001, true );
	});
});*/

/*test( "setFromRotationMatrix", function() {
  orders.forEach(function (order, index, array) {
		var q = Quaternion.createFromEuler(eulerAngles, order);
		var m = new THREE.Matrix4().setRotationFromEuler( eulerAngles, order);
		var q2 = new THREE.Quaternion().setFromRotationMatrix( m );

		ok( qSub( q, q2 ).length() < 0.001, true );
	});
});*/

test("normalize/length/lengthSquared - part 1", 4, function (assert) {
    var a = Quaternion.create(x, y, z, w);
    
    assert.notEqual(Quaternion.length(a), 1, true);
    assert.notEqual(Quaternion.lengthSquared(a), 1, true);
    
    var normA = Quaternion.normalize(a);
    
    assert.equal(Quaternion.length(normA), 1, true);
    assert.equal(Quaternion.lengthSquared(normA), 1, true);
});

test("normalize/length/lengthSquared - part 1", 4, function (assert) {
    var a = Quaternion.create(0, 0, 0, 0),
        normA = Quaternion.normalize(a);

    assert.equal(Quaternion.length(a), 0, true);
    assert.equal(Quaternion.lengthSquared(a), 0, true);
    assert.equal(Quaternion.length(normA), 1, true);
    assert.equal(Quaternion.lengthSquared(normA), 1, true);
});

test("inverse/conjugate", 4, function (assert) {
    var a = Quaternion.create(x, y, z, w);
    
    // TODO: add better validation here.
    
    var b = Quaternion.conjugate(a);
    assert.equal(a.x, -b.x, true);
    assert.equal(a.y, -b.y, true);
    assert.equal(a.z, -b.z, true);
    assert.equal(a.w, b.w, true);
});

/*
test( "multiplyQuaternions/multiply", function() {

	var angles = [ new THREE.Vector3( 1, 0, 0 ), new THREE.Vector3( 0, 1, 0 ), new THREE.Vector3( 0, 0, 1 ) ];

	var q1 = new THREE.Quaternion().setFromEuler( angles[0], "XYZ" );
	var q2 = new THREE.Quaternion().setFromEuler( angles[1], "XYZ" );
	var q3 = new THREE.Quaternion().setFromEuler( angles[2], "XYZ" );

	var q = new THREE.Quaternion().multiplyQuaternions( q1, q2 ).multiply( q3 );

	var m1 = new THREE.Matrix4().setRotationFromEuler( angles[0], "XYZ" );
	var m2 = new THREE.Matrix4().setRotationFromEuler( angles[1], "XYZ" );
	var m3 = new THREE.Matrix4().setRotationFromEuler( angles[2], "XYZ" );

	var m = new THREE.Matrix4().multiplyMatrices( m1, m2 ).multiply( m3 );

	var qFromM = new THREE.Quaternion().setFromRotationMatrix( m );

	ok( qSub( q, qFromM ).length() < 0.001, true );
});

test( "multiplyVector3", function() {
	
	var angles = [ new THREE.Vector3( 1, 0, 0 ), new THREE.Vector3( 0, 1, 0 ), new THREE.Vector3( 0, 0, 1 ) ];

	// ensure euler conversion for Quaternion matches that of Matrix4
	for( var i = 0; i < orders.length; i ++ ) {
		for( var j = 0; j < angles.length; j ++ ) {
			var q = new THREE.Quaternion().setFromEuler( angles[j], orders[i] );
			var m = new THREE.Matrix4().setRotationFromEuler( angles[j], orders[i] );

			var v0 = new THREE.Vector3(1, 0, 0);
			var qv = v0.clone().applyQuaternion( q );
			var mv = v0.clone().applyMatrix4( m );
		
			ok( qv.distanceTo( mv ) < 0.001, true );
		}
	}

});*/

test("equals - is equal", function (assert) {
	var a = Quaternion.create(x, y, z, w);
	var b = Quaternion.create(x, y, z, w);
	
	assert.equal(a.x, b.x, true);
	assert.equal(a.y, b.y, true);

	assert.ok(Quaternion.equals(a, b), true);
	assert.ok(Quaternion.equals(b, a), true);

});

test("equals - is not equal", function (assert) {
	var a = Quaternion.create(x, y, z, w);
	var b = Quaternion.create(-x, -y, -z, -w);
	
	assert.notEqual(a.x, b.x, true);
	assert.notEqual(a.y, b.y, true);

	assert.ok(!Quaternion.equals(a, b), true);
	assert.ok(!Quaternion.equals(b, a), true);

});