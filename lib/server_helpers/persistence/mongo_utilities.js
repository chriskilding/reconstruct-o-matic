/**
 * Abstracts away the hard work
 *  of accessing mongo objects.
 *
 * Some of these functions are higher-order
 * and take their getter function,
 * usually 'getCollection', as an argument.
 */

var _ = require("underscore");

function all(getter, callback) {
   getter(function (err, collection) {
        collection.find().toArray(callback);
    });
}

function find(getter, id, callback) {
    getter(function (err, collection) {
        collection.findOne({ id: id }, callback);
    });
}

function insert(rawCollection, data, callback) {
    rawCollection.insert(data, callback);
}

function update(rawCollection, id, changes, callback) {
    rawCollection.findAndModify({ id: id }, null, { $set: changes }, {}, callback);
}   

function remove(rawCollection, id, callback) {
    rawCollection.findAndModify({ id: id }, null, null, { remove: true }, callback);
}

function removeAll(rawCollection, callback) {
    rawCollection.remove({}, callback);
}

function createProvider(db, name) {
    var rawCollection = db.collection(name);
    
    var getCollection = function (callback) {
        db.collection(url, callback);
    };

    return {
        all:    _.partial(all, getCollection),
        find:   _.partial(find, getCollection),
        insert: _.partial(insert, rawCollection),
        update: _.partial(update, rawCollection),
        remove: _.partial(remove, rawCollection)
    };
}

module.exports.all = all;
module.exports.find = find;
module.exports.insert = insert;
module.exports.update = update;
module.exports.remove = remove;
module.exports.createProvider = createProvider;
module.exports.removeAll = removeAll;
