/*jslint node: true */
"use strict";

module.exports.Math = {
    "Matrix": require("./lib/math/Matrix"),
    "Quaternion": require("./lib/math/Quaternion"),
    "Triangles": require("./lib/math/Triangles"),
    "Vector3": require("./lib/math/Vector3")
};

module.exports.ServerHelpers = {
    "Client": require("./lib/server-helpers/Client"),
    "ClientSkeleton": require("./lib/server-helpers/ClientSkeleton"),
    "ClientSkeletonManager": require("./lib/server-helpers/ClientSkeletonManager"),
    "Skeleton": require("./lib/server-helpers/Skeleton"),
};

module.exports.PositionCalibrator = require("./lib/PositionCalibrator");
module.exports.RATPositionCalibrator = require("./lib/RATPositionCalibrator");
module.exports.RotationCalibrator = require("./lib/RotationCalibrator");
module.exports.SkeletonCalibrator = require("./lib/SkeletonCalibrator");
module.exports.UserCalibrator = require("./lib/UserCalibrator");

module.exports.SkeletonAggregator = require("./lib/SkeletonAggregator");
module.exports.UserAggregator = require("./lib/UserAggregator");