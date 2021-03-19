/* Copyright 2019 NXP
 * SPDX-License-Identifier: Apache-2.0
 */

const fs = require('fs')
var argDict = 
{
    enableExplorer:true, 
    explorerPort:5000,
    interfaces: {
        0: {
            interfaceType: "serial", 
            serialName: "/dev/ttyACM1", 
            baudrate: 115200
        },
        1: {
            interfaceType: "ethernet", 
            ethernetPort:4444
        }
    },
    preserveRawFiles: false,
    blockchain: "sawtooth",
    blockchainAPILocation: "http://127.0.0.1:8008"
}

module.exports = {
    interpret: function(arguments){
        if(arguments['_'] == 'none'){
            delete argDict["interfaces"]
            delete argDict['preserveRawFiles']
            argDict.enableExplorer = arguments.n
            argDict.explorerPort = arguments.x
            argDict.blockchain = arguments.c
            argDict.blockchainAPILocation = arguments.l
        } else if(arguments['_'] == 'serial'){
            delete argDict["interfaces"]["1"]
            
            argDict.enableExplorer = arguments.n
            argDict.explorerPort = arguments.x
            argDict["interfaces"]["0"].serialName = arguments.p
            argDict["interfaces"]["0"].baudrate = arguments.b
            argDict.preserveRawFiles = arguments.r
            argDict.blockchain = arguments.c
            argDict.blockchainAPILocation = arguments.l
        } else if (arguments['_'] == 'ethernet'){
            delete argDict["interfaces"]["0"]

            argDict.enableExplorer = arguments.n
            argDict.explorerPort = arguments.x
            argDict["interfaces"]["1"].ethernetPort = arguments.e
            argDict.preserveRawFiles = arguments.r
            argDict.blockchainAPILocation = arguments.l
        }else if (arguments['_'] == 'multi'){
            var raw = fs.readFileSync(arguments.c)
            var config
            try {
                config = JSON.parse(raw)
            } catch (error){
                console.log("Something went wrong at parsing the json input config, JSON.parse gave this error:")
                console.log("\t" + error)
                process.exit()
            }
            delete argDict["interfaces"]["0"]
            delete argDict["interfaces"]["1"]

            if(config["enableExplorer"]){
                argDict.enableExplorer = config["enableExplorer"]
            }
            if(config["explorerPort"]){
                argDict.explorerPort = config["explorerPort"]
            }
            if(config["preserveRawFiles"]){
                argDict.preserveRawFiles = config["preserveRawFiles"]
            }
            if(config["blockchain"]){
                argDict.blockchain = config["blockchain"]
            }
            if(config["blockchainAPILocation"]){
                argDict.blockchainAPILocation = config["blockchainAPILocation"]
            }
            if(config["interfaces"]){
                var interfacesKeys = Object.keys(config.interfaces)
                for(var i = 0; i<Object.keys(config["interfaces"]).length; i++){
                    interfaceName = interfacesKeys[i]
                    switch (config["interfaces"][interfaceName].interfaceType){
                        case 'serial':
                            argDict.interfaces[interfaceName] = {
                                interfaceType : "serial",
                                serialName : config["interfaces"][interfaceName].serialName ? config["interfaces"][interfaceName].serialName : "/dev/ttyACM1",
                                baudrate : config["interfaces"][interfaceName].baudrate ? config["interfaces"][interfaceName].baudrate : 115200
                            }
                            break;
                        case 'ethernet':
                            argDict.interfaces[interfaceName] = {
                                interfaceType : "ethernet",
                                ethernetPort : config["interfaces"][interfaceName].ethernetPort ? config["interfaces"][interfaceName].ethernetPort : 4444
                            }
                            break;
                        default:
                            console.log(config["interfaces"][interfaceName].interfaceType + 'is not a valid interface type, ignoring this one')
                    }
                }
            }
        } else {
            console.log('not a valid option, how did you get this message?')
        }
        return argDict
    }
} 