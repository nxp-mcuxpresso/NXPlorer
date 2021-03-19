/* Copyright 2019 NXP
 * SPDX-License-Identifier: Apache-2.0
 */

var fs = require("fs");
var crypto = require("crypto")
const http = require("http")

module.exports = {
    sendRawOpa: function(payload, address, preserve){
        var bytebuffer = hexToBytes(payload);
        var test = Buffer.from(bytebuffer)
        
        const sendBatch = {
            hostname: address.split('//')[1].split(':')[0],
            port: address.split('//')[1].split(':')[1],
            path: '/batches',
            method: 'POST',
            headers: {
              'Content-Type': 'application/octet-stream'
            }
        };

        if(preserve){
            var id = crypto.randomBytes(20).toString('hex')
            var fd = fs.openSync('./' + id + '.raw', 'w');
            fs.writeSync(fd, test, 0, test.length, null, function(err){
                if (err) console.log("There was an error writing the payload to the file")
            })
            fs.closeSync(fd, function(err){
                if (err) console.log("There was an error closing the file")
            });
        }
        
        var req = http.request(sendBatch)
        req.on('error', (e) => {
            console.log(`problem with sending the data to the api: ${e.message}`);
        });
        req.write(test)
        req.end()
    }
}

function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}