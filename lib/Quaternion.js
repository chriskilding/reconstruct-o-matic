// Port of the Three.js project's implementation of a Quaternion
// However we feel a more functional, 'Haskell' way of structuring the methods
// is more consistent with the rest of our codebase
// and also goes further towards referential transparency
// which reduces the risk of accidental state mutation errors

/*THREE.Quaternion.prototype = {

	copy: function ( q ) {

		this.x = q.x;
		this.y = q.y;
		this.z = q.z;
		this.w = q.w;

		return this;

	},

	
	slerp: function ( qb, t ) {

		var x = this.x, y = this.y, z = this.z, w = this.w;

		// http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

		var cosHalfTheta = w * qb.w + x * qb.x + y * qb.y + z * qb.z;

		if ( cosHalfTheta < 0 ) {

			this.w = -qb.w;
			this.x = -qb.x;
			this.y = -qb.y;
			this.z = -qb.z;

			cosHalfTheta = -cosHalfTheta;

		} else {

			this.copy( qb );

		}

		if ( cosHalfTheta >= 1.0 ) {

			this.w = w;
			this.x = x;
			this.y = y;
			this.z = z;

			return this;

		}

		var halfTheta = Math.acos( cosHalfTheta );
		var sinHalfTheta = Math.sqrt( 1.0 - cosHalfTheta * cosHalfTheta );

		if ( Math.abs( sinHalfTheta ) < 0.001 ) {

			this.w = 0.5 * ( w + this.w );
			this.x = 0.5 * ( x + this.x );
			this.y = 0.5 * ( y + this.y );
			this.z = 0.5 * ( z + this.z );

			return this;

		}

		var ratioA = Math.sin( ( 1 - t ) * halfTheta ) / sinHalfTheta,
		ratioB = Math.sin( t * halfTheta ) / sinHalfTheta;

		this.w = ( w * ratioA + this.w * ratioB );
		this.x = ( x * ratioA + this.x * ratioB );
		this.y = ( y * ratioA + this.y * ratioB );
		this.z = ( z * ratioA + this.z * ratioB );

		return this;

	},

};
*/

function createFromEuler(v, order) {
	// http://www.mathworks.com/matlabcentral/fileexchange/
	// 	20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
	//	content/SpinCalc.m
	const c1 = Math.cos(v.x / 2);
	const c2 = Math.cos(v.y / 2);
	const c3 = Math.cos(v.z / 2);
	const s1 = Math.sin(v.x / 2);
	const s2 = Math.sin(v.y / 2);
	const s3 = Math.sin(v.z / 2);

  switch (order) {
    case undefined:
      // Fall through
    case 'XYZ':
      return {
    		x: s1 * c2 * c3 + c1 * s2 * s3,
    		y: c1 * s2 * c3 - s1 * c2 * s3,
    		z: c1 * c2 * s3 + s1 * s2 * c3,
    		w: c1 * c2 * c3 - s1 * s2 * s3
      };
    case 'YXZ':
      return {
    		x: s1 * c2 * c3 + c1 * s2 * s3,
    		y: c1 * s2 * c3 - s1 * c2 * s3,
    		z: c1 * c2 * s3 - s1 * s2 * c3,
    		w: c1 * c2 * c3 + s1 * s2 * s3
      };
    case 'ZXY':
      return {
    		x: s1 * c2 * c3 - c1 * s2 * s3,
    		y: c1 * s2 * c3 + s1 * c2 * s3,
    		z: c1 * c2 * s3 + s1 * s2 * c3,
    		w: c1 * c2 * c3 - s1 * s2 * s3
      };
    case 'ZYX':
      return {
    		x: s1 * c2 * c3 - c1 * s2 * s3,
    		y: c1 * s2 * c3 + s1 * c2 * s3,
    		z: c1 * c2 * s3 - s1 * s2 * c3,
    		w: c1 * c2 * c3 + s1 * s2 * s3
      };
	  case 'YZX':
      return {
    		x: s1 * c2 * c3 + c1 * s2 * s3,
    		y: c1 * s2 * c3 + s1 * c2 * s3,
    		z: c1 * c2 * s3 - s1 * s2 * c3,
    		w: c1 * c2 * c3 - s1 * s2 * s3
      };
    case 'XZY':
      return {
    		x: s1 * c2 * c3 - c1 * s2 * s3,
    		y: c1 * s2 * c3 - s1 * c2 * s3,
    		z: c1 * c2 * s3 + s1 * s2 * c3,
    		w: c1 * c2 * c3 + s1 * s2 * s3
      };
	}
}

function createFromRotationMatrix(matrix) {
	// http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
	// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
	const	m11 = matrix[0], m12 = matrix[4], m13 = matrix[8],
	  	m21 = matrix[1], m22 = matrix[5], m23 = matrix[9],
	  	m31 = matrix[2], m32 = matrix[6], m33 = matrix[10];

	const	trace = m11 + m22 + m33;

  switch (true) {
	  case (trace > 0):
  		const a = 0.5 / Math.sqrt( trace + 1.0 );
      return {
    		w: 0.25 / a,
    		x: (m32 - m23) * a,
    		y: (m13 - m31) * a,
    		z: (m21 - m12) * a
      };
    case (m11 > m22 && m11 > m33):
		  const b = 2.0 * Math.sqrt( 1.0 + m11 - m22 - m33 );
      return {
		    w: (m32 - m23) / b,
        x: 0.25 * b,
        y: (m12 + m21) / b,
        z: (m13 + m31) / b
      };
    case (m22 > m33):
		  const c = 2.0 * Math.sqrt( 1.0 + m22 - m11 - m33 );
      return {
    		w: (m13 - m31) / c,
    		x: (m12 + m21) / c,
    		y: 0.25 * c,
    		z: (m23 + m32) / c
      };
    default:
  		const d = 2.0 * Math.sqrt( 1.0 + m33 - m11 - m22 );
      return {
    		w: (m21 - m12) / d,
    		x: (m13 + m31) / d,
    		y: (m23 + m32) / d,
    		z: 0.25 * d
      };
	}

}

// Take a quaternion
// turn it into a 3x3 rotation matrix
// if you want a 4x4 run it through expandMatrix()
// as the 4th col and row are just default 1s and 0s
function quaternionToMatrix(quat) {
  // From http://vamos.sourceforge.net/matrixfaq.htm#Q47
  const X = quat.x;
  const Y = quat.y;
  const Z = quat.z;
  const W = quat.w;
  
  const xx = X * X;
  const xy = X * Y;
  const xz = X * Z;
  const xw = X * W;

  const yy = Y * Y;
  const yz = Y * Z;
  const yw = Y * W;

  const zz = Z * Z;
  const zw = Z * W;

  return [
    // top row
    1 - 2 * (yy + zz),
    2 * (xy + zw),
    2 * (xz - yw),
    // mid row
    2 * (xy - zw),
    1 - 2 * (xx + zz),
    2 * (yz + xw),
    // bottom row
    2 * (xz + yw),
    2 * (yz - xw),
    1 - 2 * (xx + yy)
  ];
}

function multiply(a, b) {
	// from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm

	const qax = a.x, qay = a.y, qaz = a.z, qaw = a.w;
	const qbx = b.x, qby = b.y, qbz = b.z, qbw = b.w;

  return {
  	x: qax * qbw + qaw * qbx + qay * qbz - qaz * qby,
  	y: qay * qbw + qaw * qby + qaz * qbx - qax * qbz,
  	z: qaz * qbw + qaw * qbz + qax * qby - qay * qbx,
  	w: qaw * qbw - qax * qbx - qay * qby - qaz * qbz
  };
}

function inverse(vector) {
  // this.conjugate().normalize();
  return normalize(conjugate(vector));
}

function lengthSquared(vector) {
	return vector.x * vector.x + vector.y * vector.y + vector.z * vector.z + vector.w * vector.w;
}

function length(vector) {
	return Math.sqrt(lengthSquared(vector));
}

function conjugate(vector) {
	return {
	  x: vector.x * -1,
    y: vector.y * -1,
    z: vector.z * -1,
    w: vector.w
	};
}

function normalize(vector) {

	const l = length(vector);

	if ( l === 0 ) {
    return {
			x: 0,
			y: 0,
			z: 0,
			w: 1
    };
	} else {
		const newL = 1 / l;

    return {
			x: vector.x * newL,
			y: vector.y * newL,
			z: vector.z * newL,
			w: vector.w * newL
    };
	}
}

function createFromAxisAngle ( axis, angle ) {
	// from http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm
	// axis have to be normalized

	const halfAngle = angle / 2;
	const s = Math.sin( halfAngle );

	return {
		x: axis.x * s,
		y: axis.y * s,
		z: axis.z * s,
		w: Math.cos( halfAngle )
	};
}

function equals (a, b) {
	return ((b.x === a.x) && (b.y === a.y) && (b.z === a.z) && (b.w === a.w));
}

function create( x, y, z, w ) {
  return {
  	x: x || 0,
  	y: y || 0,
  	z: z || 0,
  	w: ( w !== undefined ) ? w : 1
  };
}

// Turn a 3x3 matrix into a 4x4 matrix
function expandMatrix(rot) {
  return [
    rot[0], rot[1], rot[2], 0,
    rot[3], rot[4], rot[5], 0,
    rot[6], rot[7], rot[8], 0,
    0, 0, 0, 1
  ];
}

// Turn a 4x4 matrix into a 3x3 matrix
function contractMatrix(rot) {
  return [
    rot[0], rot[1], rot[2],
    rot[4], rot[5], rot[6],
    rot[8], rot[9], rot[10]
  ];
}

// The difference (in rotation) between 2 quaternions
function delta(a, b) {
  // the quaternion q' = q1^(-1) * q2 can rotate from q1 orientation to the q2 orientation
  return multiply(inverse(a), b);
}

exports.create = create;
exports.equals = equals;
exports.expandMatrix = expandMatrix;
exports.contractMatrix = contractMatrix;
exports.createFromAxisAngle = createFromAxisAngle;
exports.normalize = normalize;
exports.conjugate = conjugate;
exports.length = length;
exports.lengthSquared = lengthSquared;
exports.inverse = inverse;
exports.multiply = multiply;
exports.createFromRotationMatrix = createFromRotationMatrix;
exports.quaternionToMatrix = quaternionToMatrix;
exports.createFromEuler = createFromEuler;
exports.delta = delta;