/*jslint node: true */
"use strict";

/**
 * This takes in a room key, reference client, and input client
 * and figures out if that client is the reference client
 * for the room.
 *
 * @param referenceClients Persistence store mapping rooms to reference clients.
 */
module.exports.isReference = function (referenceClient, inputClient) {    
	return ((referenceClient === null) || (referenceClient === inputClient));
};
