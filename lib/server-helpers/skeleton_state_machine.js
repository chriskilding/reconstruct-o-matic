// Defines a state machine wrapped around the Skeleton

var state = require("state");
var UserAggregator = require("../UserAggregator");

/**
 * Create an FSM-controlled data store.
 *
 * The state machine will flip between
 * accepting new pushes from clients
 * and condensing + pushing the result of a frame of data
 * (and then clearing the cache to start again).
 *
 * @param store This should look like the Skeleton.js export.
 * @param fsm This should act like an object, usually it is {}.
 */
module.exports = function (queue, fsm) {
    state(fsm, {
        "open": state({
            add: function (key, data) {
                // Add another result to the list
                queue.push(key, data);
            }
        }),
        "finish": state({
            add: function (key, data, callback) {
                // Condense and reduce all obtained results
                // from this window of data.
                // var finalVersion = store.finishWindow();
                queue.all(key, function (err, savedData) {
                    // Clear the queue
                    queue.clear();
                    
                    // Compute the final skeleton
                    var result = UserAggregator.condenseUser(savedData);

                    // Then push the reference client's data
                    // this will start the next frame,
                    // but not be included in the returned results
                    // for this frame.
                    queue.push(key, data);

                    // Then go back to the "open" state.
                    fsm.state("open");
                    
                    // Now return the final data
                    callback(result);
                });    
            }
        })
    });   
};

