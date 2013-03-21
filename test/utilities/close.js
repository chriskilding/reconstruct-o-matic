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
	var passes = isClose(actual, expected, maxDifference);
	QUnit.push(passes, actual, expected, message);
}

// Just the true/false value, doesn't touch QUnit
function isClose(actual, expected, maxDifference) {
  return (actual === expected) || Math.abs(actual - expected) <= maxDifference;
}

// Just the true/false value, doesn't touch QUnit
function isNotClose(actual, expected, minDifference) {
  return Math.abs(actual - expected) > minDifference;
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
	var passes = isNotClose(actual, expected, minDifference);
  QUnit.push(passes, actual, expected, message);
}

// Adding some array functions for convenience
function arrayClose(actual, expected, maxDifference, message) {
  if (actual.length != expected.length) {
    ok(false, "actual and expected arrays not the same length");
  }
  else {
    var allGood = true;
    
    for (var i = 0; i < actual.length; i++) {
      var exp = expected[i];
      var act = actual[i];

      if (!isClose(act, exp, maxDifference)) {
        allGood = false;
        break;
      }
    }
    
    QUnit.push(allGood, actual, expected, message);
  }
}

exports.close = close;
exports.notClose = notClose;
exports.arrayClose = arrayClose;