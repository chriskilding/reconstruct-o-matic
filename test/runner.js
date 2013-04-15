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
        deps: {
            path: "test/Fixtures.js",
            namespace: "Fixtures"
        },
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
        deps: {
            path: "test/Fixtures.js",
            namespace: "Fixtures"
        },
        code: {
            path: "lib/SkeletonCalibrator.js",
            namespace: "SkeletonCalibrator"
        },
        tests: "test/SkeletonCalibratorTest.js"
    },
    {
        deps: {
            path: "test/Fixtures.js",
            namespace: "Fixtures"
        },
        code: {
            path: "lib/math/Quaternion.js",
            namespace: "Quaternion"
        },
        tests: "test/QuaternionTest.js"
    },
    {
        deps: {
            path: "test/Fixtures.js",
            namespace: "Fixtures"
        },
        code: {
            path: "lib/math/Vector3.js",
            namespace: "Vector3"
        },
        tests: "test/Vector3Test.js"
    },
    {
        deps: {
            path: "test/Fixtures.js",
            namespace: "Fixtures"
        },
        code: {
            path: "lib/SkeletonAggregator.js",
            namespace: "SkeletonAggregator"
        },
        tests: "test/SkeletonAggregatorTest.js"
    }
], function (err, report) {
    console.log(report);
});