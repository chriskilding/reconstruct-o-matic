var testrunner = require("qunit");
//console.log(testrunner.options);
testrunner.options.log.tests = false;

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
          path: "lib/Triangles.js",
          namespace: "Triangles"
        },
        tests: "test/TrianglesTest.js"
    }
    
], function(err, report) {
    console.log(report);
});