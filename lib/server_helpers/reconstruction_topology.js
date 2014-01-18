var storm = require("simplestorm");

var SignalSpout = require("./spouts/signal_spout");

var IsReferenceClientBolt = require("./bolts/calibration/is_reference_client_bolt");
var CalibrationPreprocessorBolt = require("./bolts/reconstruction/calibration_preprocessor_bolt");
var FrameDataStorageBolt = require("./bolts/reconstruction/frame_data_storage_bolt");
var ReconstructionBolt = require("./bolts/reconstruction/reconstruction_bolt");
var SocketioOutputBolt = require("./bolts/reconstruction/socketio_output_bolt");

// Sets up the reconstruction topology
// The db which is used for persistence is passed
// as a dependency.
module.exports = function (db, io, signal) {
    var builder = storm.createTopologyBuilder();

    builder.setSpout("spout", new SignalSpout(signal));

	builder.setBolt("isReferenceClient", new IsReferenceClientBolt(db))
		.shuffleGrouping("calibrationPreprocessor")
		.shuffleGrouping("spout");

    builder.setBolt("calibrationPreprocessor", new CalibrationPreprocessorBolt())
    	.shuffleGrouping("frameSaver")
    	.shuffleGrouping("spout");
    	
    builder.setBolt("frameSaver", new FrameDataStorageBolt(db))
    	.shuffleGrouping("reconstructor");
    	
    builder.setBolt("reconstructor", new ReconstructionBolt())
    	.shuffleGrouping("outputter");
    	
    builder.setBolt("outputter", new SocketioOutputBolt(io));

    return builder.createTopology();
};
