/*jslint node: true */
"use strict";

// Some functional-style matrix utility methods

// Take a 3x3 rotation matrix
// and x, y, z position vector
// and create a combined transform
function transformMatrix(rot, pos) {
    return [
        rot[0], rot[1], rot[2], 0,
        rot[3], rot[4], rot[5], 0,
        rot[6], rot[7], rot[8], 0,
        pos[0], pos[1], pos[2], 1
    ];
}

// Turn a 3x3 matrix into a 4x4 matrix
function expandMatrix(rot) {
    return transformMatrix(rot, [0, 0, 0]);
}

// Turn a 4x4 matrix into a 3x3 matrix
function contractMatrix(rot) {
    return [
        rot[0], rot[1], rot[2],
        rot[4], rot[5], rot[6],
        rot[8], rot[9], rot[10]
    ];
}

exports.expandMatrix = expandMatrix;
exports.contractMatrix = contractMatrix;
exports.transformMatrix = transformMatrix;