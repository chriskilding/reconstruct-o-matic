/*jslint node: true */
"use strict";

// Take rotation readings from multiple sensors and reconstruct them
// Readings will typically be a 3x3 rotation matrix...
// In general, the component Rij of a rotation matrix
// equals the cosine of the angle between the ith axis of the original coordinate system
// and the jth axis of the rotated coordinate system.
// (From http://www.mathpages.com/home/kmath593/kmath593.htm)

var Quaternion = require("./Quaternion");
var Matrix = require("./Matrix");

// After calibration has happened and we got some 'real' rotation data
// transform it to be in terms of the reference sensor's coord system
function convertRealData(newQuat, deltaQuat) {
    // Transform the newQuat by deltaQuat
    // to turn a rotation captured by secondary sensor
    // into one that could have been captured by reference sensor
    return Quaternion.quaternionToMatrix(Quaternion.multiply(newQuat, deltaQuat));
}

// Take a 3x3 rotation matrix
// turn it into a 4x4 quaternion
function prepMatrix(mat) {
    return Quaternion.createFromRotationMatrix(Matrix.expandMatrix(mat));
}

// Rotation normalization per joint
// When calibrating a secondary sensor
// this produces a new quaternion
// which can take a rotation of [otherMatrix]
// and rotate it to [referenceMatrix]
function rotationDelta(referenceMatrix, otherMatrix) {
    // NOTE argument order is important - 1. otherQuat, 2. refQuat!
    return Quaternion.delta(prepMatrix(otherMatrix), prepMatrix(referenceMatrix));
}

// Returns a lambda function that you will apply to all 'real' data you receive
// to express a rotation matrix from a secondary sensor
// in terms of the coordinate system of the reference sensor
// (depending on your setup you may prefer to use this)
function calibrateRotation(refRotation, otherRotation) {
    var deltaQuat = rotationDelta(refRotation, otherRotation);
    
    return function (newRotMatrix) {
        return convertRealData(prepMatrix(newRotMatrix), deltaQuat);
    };
}



// The main function of interest
exports.calibrateRotation = calibrateRotation;
// Supporting functions
exports.convertRealData = convertRealData;
exports.rotationDelta = rotationDelta;
exports.prepMatrix = prepMatrix;