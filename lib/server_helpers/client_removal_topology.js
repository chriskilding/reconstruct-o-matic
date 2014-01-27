var storm = require("simplestorm");

var SignalSpout = require("./spouts/signal_spout");

var GetReferenceClientBolt = require("./bolts/get_reference_client_bolt");
var IsReferenceClientBolt = require("./bolts/is_reference_client_bolt");
var RemoveClientBolt = require("./bolts/calibration/remove_client_bolt");
var SignalOutputBolt = require(???);

// Sets up the calibration topology
// The db which is used for persistence is passed
// as a dependency.
module.exports = function (db, inputSignal, outputSignal) {
    var builder = storm.createTopologyBuilder();

    builder.setSpout("spout", new SignalSpout(inputSignal));

	builder.setBolt("getReferenceClient", new GetReferenceClientBolt(db))
		.shuffleGrouping("isReferenceClient")
		.shuffleGrouping("spout");

	builder.setBolt("isReferenceClient", new IsReferenceClientBolt(db))
		.shuffleGrouping("clientRemover")
		
    builder.setBolt("clientRemover", new RemoveClientBolt(db))
    	.shuffleGrouping("signalOutput");
    	
    builder.setBolt("signalOutput", new SignalOutputBolt(outputSignal));

    return builder.createTopology();
};
