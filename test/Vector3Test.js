QUnit.module("Vector3");

var closetest = require("./utilities/close");

test("add - simple case", 1, function() {
  const a = [1, 1, 1];
  const b = [2, 2, 2];
  
  deepEqual(Vector3.add(a, b), [3, 3, 3], true);
});

test("divideByValue - simple case", 1, function() {
  const a = [6, 6, 6];
  
  deepEqual(Vector3.divideByValue(a, 3), [2, 2, 2], true);
});

test("addVectors - simple case", 1, function() {
  const arr = [
    [6, 6, 6],
    [4, 4, 4],
    [5, 5, 5]
  ];
  
  const actual = Vector3.addVectors(arr);
  const expected = [15, 15, 15];
  
  deepEqual(actual, expected, true);
});

test("averageOfVectors - simple case", 1, function() {
  const arr = [
    [2, 2, 2],
    [4, 4, 4],
    [6, 6, 6]
  ];
  
  const actual = Vector3.averageOfVectors(arr);
  const expected = [4, 4, 4];
  
  deepEqual(actual, expected, true);
});

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