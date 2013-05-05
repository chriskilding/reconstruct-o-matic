/*jslint node: true */
"use strict";

var testrunner = require("qunit");
//console.log(testrunner.options);
testrunner.options.log.assertions = false;

// array of code and test files
testrunner.run([
    {
        code: {
            path: "lib/RATPositionCalibrator.js",
            namespace: "RATPositionCalibrator"
        },
        tests: "test/RATPositionCalibratorTest.js"
    },
    {
        code: {
            path: "lib/PositionCalibrator.js",
            namespace: "PositionCalibrator"
        },
        tests: "test/PositionCalibratorTest.js"
    },
    {
        code: {
            path: "lib/RotationCalibrator.js",
            namespace: "RotationCalibrator"
        },
        tests: "test/RotationCalibratorTest.js"
    },
    {
        code: {
            path: "lib/math/Triangles.js",
            namespace: "Triangles"
        },
        tests: "test/TrianglesTest.js"
    },
    {
        code: {
            path: "lib/SkeletonCalibrator.js",
            namespace: "SkeletonCalibrator"
        },
        tests: "test/SkeletonCalibratorTest.js"
    },
    {
        code: {
            path: "lib/math/Quaternion.js",
            namespace: "Quaternion"
        },
        tests: "test/QuaternionTest.js"
    },
    {
        code: {
            path: "lib/math/Vector3.js",
            namespace: "Vector3"
        },
        tests: "test/Vector3Test.js"
    },
    {
        code: {
            path: "lib/SkeletonAggregator.js",
            namespace: "SkeletonAggregator"
        },
        tests: "test/SkeletonAggregatorTest.js"
    },
    {
        code: {
            path: "lib/math/Matrix.js",
            namespace: "Matrix"
        },
        tests: "test/MatrixTest.js"
    },
    {
        code: {
            path: "lib/UserAggregator.js",
            namespace: "UserAggregator"
        },
        tests: "test/UserAggregatorTest.js"
    },
    {
        code: {
            path: "lib/server-helpers/Skeleton.js",
            namespace: "Skeleton"
        },
        tests: "test/SkeletonTest.js"
    }
], function (err, report) {
    console.log(report);
});