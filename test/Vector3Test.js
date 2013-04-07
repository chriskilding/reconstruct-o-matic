QUnit.module("Vector3");

var closetest = require("./utilities/close");

test("applyQuaternion - no delta = no change", 3, function() {
  var delta = { x: 0, y: 0, z: 0, w: 1 };
  
  var position = { x: 1, y: 1, z: 1 };

  var actual = Vector3.applyQuaternion(position, delta);
  
  ok((actual.x == position.x), true);
  ok((actual.y == position.y), true);
  ok((actual.z == position.z), true);

});

test("applyQuaternion - rotate in z by 90 degrees", 1, function() {
  
  var delta = Fixtures.zRotation90;
  
  var position = { x: 1, y: 1, z: 1 };

  var actual = Vector3.applyQuaternion(position, delta);
  
  // The vector should have been rotated in z
  var expected = {
    x: 0,
    y: 0,
    z: 0
  };
  
  equal(actual, expected, true);
});