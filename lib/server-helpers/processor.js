/*jslint node: true */
"use strict";

var Skeleton = require("./skeleton_state_machine");

/**
 * The processor does not know any details about its clients
 * a separate manager module handles wiring up reference vs secondary clients.
 * The processor just receives input
 * and, when ready, spits out reconstructions.
 *
 * @param wires This must look like { input: { reference: [Signal], secondary: [Signal] }, output: [Signal] }.
 * @param skeletonFsm the FSM to control the skeletonQueue, usually a {}.
 */
module.exports = function (queue, wires) {
	var skeletonFsm = {};
    var skeletonQueue = Skeleton(queue, skeletonFsm);
    
    // Ensure starting in the "open" state
    skeletonFsm.state("open");
    
    wires.input.reference.add(function (data) {
    	// Switch to 'frame done' state
    	skeletonFsm.state("finish");
    	
    	// Perform push
    	skeletonQueue.add(data, function (result) {
			if (result) {
				// Relay the result
				wires.output.trigger(result);
			}
    	);
    });
    
    wires.input.secondary.add(function (data) {
    	// Nothing special required
    	// just add it
    	skeletonQueue.add(data);
    });
};