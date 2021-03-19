/* Copyright 2019 NXP
 * SPDX-License-Identifier: Apache-2.0
 */

const Net = require('net');
const helper = require("../Helpers/interfaceHelper")
const delim = "ZZ";
const server = new Net.Server();
var buffer = "";
var port;
var preserve;

server.on('connection', function(socket) {
    console.log('a connection happened')
    socket.on('data', function(chunk) {
        if (chunk.toString().substring(chunk.length-2,chunk.length) == delim) {
            buffer = buffer + chunk.toString().substring(0,chunk.length-2);
            helper.sendRaw(buffer, preserve)
        } else {
            buffer = chunk;
        }
	});
    socket.on('end', function() {
        console.log('Closing connection with the client');
    });

	socket.on('error', function(err) {
        console.log("Ethernet has thrown an error: " + err + "\r\nExiting");
    });
});
server.on('error', function(err){
    console.log("Ethernet has thrown an error: " + err + "\r\nExiting");
})

module.exports = {
    start: function(ethport, preserveRaw){
        server.listen(ethport, function() {
            port = ethport
            preserve = preserveRaw
        });
    }
}