// A handful of Vector operations with a functional flavour

// Transform a vector3
// with a quaternion
function applyQuaternion(vector, quaternion) {
	const x = vector.x;
	const y = vector.y;
	const z = vector.z;

	const qx = quaternion.x;
	const qy = quaternion.y;
	const qz = quaternion.z;
	const qw = quaternion.w;

	// calculate quat * vector

	const ix =  qw * x + qy * z - qz * y;
	const iy =  qw * y + qz * x - qx * z;
	const iz =  qw * z + qx * y - qy * x;
	const iw = -qx * x - qy * y - qz * z;

	// calculate result * inverse quat
  return {
		x: ix * qw + iw * -qx + iy * -qz - iz * -qy,
		y: iy * qw + iw * -qy + iz * -qx - ix * -qz,
		z: iz * qw + iw * -qz + ix * -qy - iy * -qx
	};
}

// Represent vector as [x, y, z]
function vectorAsArray(vectorObj) {
  return [
    vectorObj.x,
    vectorObj.y,
    vectorObj.z
  ];
}

// Represent vector as {x: 0, y: 0, z: 0}
function vectorAsObject(vectorArr) {
  return {
    x: vectorArr[0],
    y: vectorArr[1],
    z: vectorArr[2]
  };
}

// Add 2 vectors together
function add(a, b) {
  return a.map(function(val, i) {
    return val + b[i];
  });
}

function divideByValue(vec, value) {
  return vec.map(function(elem) {
    return elem / value;
  });
}

// Add a whole array of vectors together
function addVectors(arr) {
  return arr.reduce(function(a, b) {
    return add(a, b);
  });
}

// Pass in an array of vectors that looks like:
// [ [1, 1, 1], [2, 2, 2] etc.]
function averageOfVectors(arr) {
  // Add em all up, then divide the resulting vector
  // by total num of vectors
  return divideByValue(addVectors(arr), arr.length);    
}

exports.applyQuaternion = applyQuaternion;
exports.vectorAsArray = vectorAsArray;
exports.vectorAsObject = vectorAsObject;
exports.add = add;
exports.divideByValue = divideByValue;
exports.addVectors = addVectors;
exports.averageOfVectors = averageOfVectors;