/* Copyright 2019 NXP
 * SPDX-License-Identifier: Apache-2.0
 */

const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const helper = require("../Helpers/interfaceHelper")

module.exports = {
    start: function(portname, baudrate, address,  preserve){
        var serial = new SerialPort(portname,{ baudRate: baudrate }, function(err){
            if (err){
                console.log("Serial has thrown an error:\r\n" + err + "\r\nExiting")
                process.exit()
            }
        })
        const parser = serial.pipe(new Readline({ delimiter: '\r\n' }))

        parser.on('data', function(data){
            if(data.substring(0,5) == 'XYZZY'){
                console.log("XYZZY detected sending payload to sawtooth")
                var payload = data.substring(5, data.length)
                helper.sendRawOpa(payload, address, preserve)
            }
        })
    }
}