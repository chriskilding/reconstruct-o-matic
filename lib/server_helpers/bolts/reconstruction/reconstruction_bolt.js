var UserAggregator = require("../UserAggregator");

/**
 * Gets a bunch of user skeletons and condenses them.
 */
module.exports = function () {
	this.process = function (tuple, collector) {
		// Destructure the tuple
		var users     = tuple.users;
		
		// Compute the final skeleton
		var result = UserAggregator.condenseUser(users);

		collector.emit({
			reconstruction: result
		});
	};
};

