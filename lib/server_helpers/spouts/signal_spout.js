// This spout relays js-signal event requests
module.exports = function (signal) {
    this.start = function (context) {
        signal.add(context.emit);
    };
};
