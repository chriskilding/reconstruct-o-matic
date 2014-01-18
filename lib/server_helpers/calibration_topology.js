var storm = require("simplestorm");

var SignalSpout = require("./spouts/js_signal_spout");

var IsReferenceClientBolt = require("./bolts/calibration/is_reference_client_bolt");
var AddClientBolt = require("./bolts/calibration/add_client_bolt");
var TransformCalculationBolt = require("./bolts/calibration/transform_calculation_bolt");

// Sets up the calibration topology
// The db which is used for persistence is passed
// as a dependency.
module.exports = function (db, signal) {
    var builder = storm.createTopologyBuilder();

    builder.setSpout("spout", new SignalSpout(signal));

	builder.setBolt("isReferenceClient", new IsReferenceClientBolt(db))
		.shuffleGrouping("clientAdder")
		.shuffleGrouping("spout");
		
    builder.setBolt("clientAdder", new AddClientBolt(db))
    	.shuffleGrouping("transformCalculator");
    	
    builder.setBolt("tranformCalculator", new TransformCalculationBolt(db))
    	.shuffleGrouping("transformSaver");
    	
    builder.setBolt("transformSaver", new ????);

    return builder.createTopology();
};
