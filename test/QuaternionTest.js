// Adapted from the Three.js unit tests for the same module

/**
 * @author bhouston / http://exocortex.com
 */

QUnit.module("Quaternion");

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

var realData = [0.9178107380867004, -0.04468444734811783, -0.3944951295852661, 0.1306413114070892, 0.9723015427589417, 0.1938103586435318, 0.3749079704284668, -0.2294186502695084, 0.8982265591621399];

/*var qSub = function ( a, b ) {
	var result = Quaternion.create(a);
	result.copy( a );

	result.x -= b.x;
	result.y -= b.y;
	result.z -= b.z;
	result.w -= b.w;

	return result;

};*/

test("create - no args", function() {
	var a = Quaternion.create();
	ok( a.x == 0, true);
	ok( a.y == 0, true);
	ok( a.z == 0, true);
	ok( a.w == 1, true);
});

test("create - with args", function() {
	var a = Quaternion.create( x, y, z, w );
	ok( a.x === x, true);
	ok( a.y === y, true);
	ok( a.z === z, true);
	ok( a.w === w, true);
});

test( "createFromAxisAngle", function() {

	// TODO: find cases to validate.
  
	var zero = Quaternion.create();

	var a = Quaternion.createFromAxisAngle({x: 1, y: 0, z: 0}, 0);
	ok(Quaternion.equals(a, zero), true);
  
	var b = Quaternion.createFromAxisAngle({x: 0, y: 1, z: 0}, 0);
	ok(Quaternion.equals(b, zero), true);
  
	var c = Quaternion.createFromAxisAngle({x: 0, y: 0, z: 1}, 0);
	ok(Quaternion.equals(c, zero), true);

	var a1 = Quaternion.createFromAxisAngle({x: 1, y: 0, z: 0}, Math.PI);
	ok(!Quaternion.equals(a, a1), true);

	var a2 = Quaternion.createFromAxisAngle({x: 1, y: 0, z: 0}, -Math.PI);
	ok(!Quaternion.equals(a, a2), true);

	var mult = Quaternion.multiply(a1, a2);
	ok(Quaternion.equals(a, mult), true);
});

test("to and from rotation matrix", function() {
  var mat = Quaternion.expandMatrix(realData);
	
  var quat = Quaternion.createFromRotationMatrix(mat);
  
  var back = Quaternion.quaternionToMatrix(quat);
	deepEqual(back, realData, true);
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

test( "normalize/length/lengthSquared - part 1", function() {
	var a = Quaternion.create(x, y, z, w);

	ok(Quaternion.length(a) != 1, true);
	ok(Quaternion.lengthSquared(a) != 1, true);
	
  var normA = Quaternion.normalize(a);
  
	ok(Quaternion.length(normA) == 1, true);
	ok(Quaternion.lengthSquared(normA) == 1, true);
});

test( "normalize/length/lengthSquared - part 1", function() {
	var a = Quaternion.create(0, 0, 0, 0);

	ok(Quaternion.length(a) == 0, true);
	ok(Quaternion.lengthSquared(a) == 0, true);
	
  var normA = Quaternion.normalize(a);
  
	ok(Quaternion.length(normA) == 1, true);
	ok(Quaternion.lengthSquared(normA) == 1, true);
});

test( "inverse/conjugate", function() {
	var a = Quaternion.create( x, y, z, w );

	// TODO: add better validation here.
  
	var b = Quaternion.conjugate(a);
	ok( a.x == -b.x, true );
	ok( a.y == -b.y, true );
	ok( a.z == -b.z, true );	
  ok( a.w == b.w, true );
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

test("equals", function() {
	var a = Quaternion.create( x, y, z, w );
	var b = Quaternion.create( -x, -y, -z, -w );
	
	ok( a.x != b.x, true );
	ok( a.y != b.y, true );

	ok(!Quaternion.equals(a, b), true );
	ok(!Quaternion.equals(b, a), true );

});