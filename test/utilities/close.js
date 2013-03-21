// Node port of QUnit close-enough plugin
//require("qunit");

/**
 * Checks that the first two arguments are equal, or are numbers close enough to be considered equal
 * based on a specified maximum allowable difference.
 *
 * @example close(3.141, Math.PI, 0.001);
 *
 * @param Number actual
 * @param Number expected
 * @param Number maxDifference (the maximum inclusive difference allowed between the actual and expected numbers)
 * @param String message (optional)
 */
function close(actual, expected, maxDifference, message) {
	var passes = (actual === expected) || Math.abs(actual - expected) <= maxDifference;
	QUnit.push(passes, actual, expected, message);
  //ok(passes, message);
}

/**
 * Checks that the first two arguments are numbers with differences greater than the specified
 * minimum difference.
 *
 * @example notClose(3.1, Math.PI, 0.001);
 *
 * @param Number actual
 * @param Number expected
 * @param Number minDifference (the minimum exclusive difference allowed between the actual and expected numbers)
 * @param String message (optional)
 */
function notClose(actual, expected, minDifference, message) {
	var passes = Math.abs(actual - expected) > minDifference;
  QUnit.push(passes, actual, expected, message);
  //ok(passes, message);
}

exports.close = close;
exports.notClose = notClose;