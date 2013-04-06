QUnit.module("Vector3");

var closetest = require("./utilities/close");

test("applyQuaternion - no delta = no change", 3, function() {
  var delta = Fixtures.zeroRotation;
  
  var position = { x: 1, y: 1, z: 1 };

  var actual = Vector3.applyQuaternion(position, delta);
  
  ok((actual.x == position.x), true);
  ok((actual.y == position.y), true);
  ok((actual.z == position.z), true);

});

/*test("applyQuaternion - rotate in z by 90 degrees", 1, function() {
  // From http://wiki.alioth.net/index.php/Quaternion
  // For a given axis (x y z) and angle (α), the quaternion representing a rotation of a degrees around the axis from the origin (0,0,0) to (x,y,z) is:
  // W = cos (0.5 × α)
  // X = x × sin (0.5 × α)
  // Y = y × sin (0.5 × α)
  // Z = z × sin (0.5 × α)
  //
  // So a rotation of 90 degrees about the z axis (0 0 1) would be:
  //
  // W = cos 45 ° = 0.707...
  // X = 0 × sin 45 ° = 0
  // Y = 0 × sin 45 ° = 0
  // Z = 1 × sin 45 ° = 0.707...
  //
  // JS math methods use radians so...
  // 2 pi rads in a circle
  // pi rads = 180 deg
  // pi/2 = 90 deg
  // pi/4 = 45 deg
  
  var delta = {
    x: 0,
    y: 0,
    z: Math.sin(Math.PI / 4),
    w: Math.cos(Math.PI / 4)
  };
  
  var position = { x: 1, y: 1, z: 1 };

  var actual = Vector3.applyQuaternion(position, delta);
  
  // The vector should have been rotated in z
  var expected = {
    x:
    y:
    z:
  };
  
  equal(actual, expected, true);
});*/