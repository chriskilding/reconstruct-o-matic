var redis = require('redis');
var db = redis.createClient(6379, 'localhost');

var combiner = require("./SkeletonAggregator");

function addClientToGroup(commonSessionId, clientId) {
  // Add the user as the latest member of the group
  db.rpush('usergroups', commonSessionId, clientId);
}

function push(commonSessionId, clientId, skeletonData) {
  // Each source will be sending skeleton data at various times
  // They don't share a common clock
  // So we need some way to identify packets of data
  // as belonging to the same time window.
  //
  // Pick an arbitrary 'authoritative' data source
  // this will set the pace for the others
  // we have chosen that the first client in the list is the authoritative one.
  var authoritativeClientId = db.lindex('usergroups', commonSessionId, 0); 
  
  if (authoritativeClientId == clientId) {
    // Retrieve all the skeletons
    db.lrange('skeletons', commonSessionId, 0, -1);
    
    var result = combiner.combine(this.skeletons);
    
    // Clear out the list
    db.ltrim('skeletons', commonSessionId, 0, -1);
    
    // A non-null return also means we have moved on to the next frame of data
    return result;
  }
  
  // Add to the array of skeletons for the current frame
  db.rpush('skeletons', commonSessionId, skeletonData);
}

exports.addClientToGroup = addClientToGroup;
exports.push = push;