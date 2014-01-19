// Abstracts the rooms collection
var mongoUtils = require("./mongo_utilities");

module.exports = function (db) {
    return mongoUtils.createProvider(db, "rooms"); 
}
