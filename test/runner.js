var testrunner = require("qunit");

// array of code and test files
testrunner.run([
    {
        code: "lib/PositionCalibrator.js",
        tests: "test/PositionCalibratorTest.js"
    }
], function(err, report) {
    console.log(report);
});