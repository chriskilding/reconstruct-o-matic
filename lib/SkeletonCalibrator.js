/*jslint node: true */
"use strict";

// The reference coordinate system is that used by the authoritative client / sensor
// so when we get a skeleton from another secondary sensor
// we need to rotate it and translate it
// so the secondary skeleton's coordinates are "as if viewed by the primary sensor".
//
// To do this, a calibration step is needed:
// the user must first stand in a place where both (all) sensors can see them.
// So our calculations are not based on sensors looking for *each other*
// but on their views of one common object located between them (the user).
//
// Then we work out the difference in distance from primary and other sensor
// this tells us how far 'off' the other sensor is
// i.e. how much skeleton coordinates from that sensor need to be translated by.
// And we work out this difference for each secondary sensor used.

var PositionCalibrator = require("./PositionCalibrator");
var RotationCalibrator = require("./RotationCalibrator");
var Vector3 = require("./math/Vector3");
var Quaternion = require("./math/Quaternion");

var _ = require("underscore");

// 3x3 zeroes matrix
var zeroes = [0, 0, 0, 0, 0, 0, 0, 0, 0];

// Reconstruct the position of one joint
function reconstructJoint(realJoint, positionDelta, rotationDelta) {
    // TODO this is modifying the passed object, can we do better?
    realJoint.position = PositionCalibrator.convertRealVector(realJoint.position, positionDelta);
    realJoint.rotation = RotationCalibrator.convertRealData(RotationCalibrator.prepMatrix(realJoint.rotation), rotationDelta);
    return realJoint;
}

// Reconstruct a whole skeleton
function reconstructSkeleton(realSkeleton, positionDelta, rotationDelta) {
    return realSkeleton.map(function (realJoint) {
        return reconstructJoint(realJoint, positionDelta, rotationDelta);
    });
}

// Reconstruct a whole skeleton as a JS object
function reconstructSkeletonAsObject(realSkeleton, positionDelta, rotationDelta) {
    // (value, key, list)
    // value = joint data
    var joints = _.chain(realSkeleton)
        .values()
        .map(function (joint) {
            return reconstructJoint(joint, positionDelta, rotationDelta);
        })
        .value();
    
    // key = joint id
    var jointIds = _(realSkeleton).keys();
    
    return _.object(jointIds, joints);
}

function averagePosition(combinedJointDataArray) {
    // Note that the rotation is not properly tracked for all joints:
    // some always have a rotation matrix of [0, 0... 0]
    // so to get past this
    // we need to get the transformations from every joint with valid data
    return _.chain(combinedJointDataArray)
        // Just operate on position deltas for now
        .pluck("positionDeltaVector")
        // Add up all the position deltas
        // starting with a blank 3-element array
        .reduce(function (memo, posDeltaVec) {
            return Vector3.add(memo, posDeltaVec);
        }, [0, 0, 0])
        // This yields a single 'sum' vector
        // Divide by the num of position deltas
        .map(function (value) {
            return value / combinedJointDataArray.length;
        })
        // And there's your average translation vector!
        .value();
}

function averageRotation(combinedJointDataArray) {
    // Extract only the rotation deltas
    // then stick the whole array through the quaternion averager
    // yielding one final quaternion
    return Quaternion.average(_.pluck(combinedJointDataArray, "rotationDeltaQuaternion"));
}

// A joint contains
// id, position, position confidence, rotation, rotation confidence
// this function assumes the rotation matrix it gets for a joint is valid
// so it's your responsibility to ensure this if you call it
function computeJointDelta(refJoint, otherJoint) {
    // Get the rotation delta first
    var deltaQuat = RotationCalibrator.rotationDelta(refJoint.rotation, otherJoint.rotation);
    
    // Align the coord systems of both sensors by rotating the raw position value  
    // Now work out the position in this rotated coord system
    var rotatedPosition = Vector3.vectorAsArray(
        Vector3.applyQuaternion(Vector3.vectorAsObject(otherJoint.position), deltaQuat)
    );
    
    // So with coord systems of both sensors aligned,
    // the 'other' sensor / joint is now
    // [m, n, o] away from the reference reading
    // find this distance
    var positionDelta = PositionCalibrator.deltaBetweenSensors(refJoint.position, rotatedPosition);
    
    // Return a tuple of position and rotation deltas
    return {
        positionDeltaVector: positionDelta,
        rotationDeltaQuaternion: deltaQuat
    };
}

// Does the sanity checking around computeJointDelta
function calibrateJoint(refJoint, otherJoint) {        
    // If either joint has all-zero rotation matrices
    // or there is no reading for it
    // the data from the respective sensor is not correct
    // you can't do calibration unless all sensors give good data
    // so null should be returned
    if (!refJoint || !otherJoint || _.isEqual(refJoint.rotation, zeroes) || _.isEqual(otherJoint.rotation, zeroes)) {
        return null;
    } else {
        return computeJointDelta(refJoint, otherJoint);
    }
}

// Calibrate the system
// figure out the orientations of the sensor on each client
// relative to the authoritative client
// and return a transform matrix for each secondary sensor
// NOTE: IF YOU ARE JUST USING THIS MODULE TO PERFORM CALIBRATION,
// THIS IS THE FUNCTION YOU NEED.
function calibrateSkeleton(refSkeleton, otherSkeleton) {
    var combinedJointDataArray = _.zip(_.values(refSkeleton), _.values(otherSkeleton));
    
    var preOut = _.chain(combinedJointDataArray)
        // Get calibration for every ref-other joint pair 
        .map(function (elem, index) {
            return calibrateJoint(elem[0], elem[1]);
        })
        // Strip the nulls from when invalid data was supplied
        .compact()
        .value();
    
    // then you can apply this one transformation to every joint
    // (plus the overall user position vector of course)
    // when the real data rolls in
    return {
        positionDelta: averagePosition(preOut),
        rotationDelta: averageRotation(preOut)
    };
}

// Alternative to calibrateSkeleton
// which returns a lambda
// that you can call with your 'real' data
// and which will apply the transformation to it
// (you may prefer this approach depending on your needs)
function calibrate(refSkeleton, otherSkeleton) {
    var delta = calibrateSkeleton(refSkeleton, otherSkeleton);
    
    return function (realSkeleton) {
        // Don't crash if finding delta was not successful
        if (delta) {
            return reconstructSkeletonAsObject(realSkeleton, delta.positionDelta, delta.rotationDelta);
        } else {
            return realSkeleton;
        }
    };
}


exports.reconstructSkeleton = reconstructSkeleton;
exports.reconstructSkeletonAsObject = reconstructSkeletonAsObject;
exports.reconstructJoint = reconstructJoint;
exports.averagePosition = averagePosition;
exports.averageRotation = averageRotation;
exports.calibrate = calibrate;
exports.calibrateSkeleton = calibrateSkeleton;
exports.calibrateJoint = calibrateJoint;
exports.computeJointDelta = computeJointDelta;