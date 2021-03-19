/* Copyright 2019 NXP
 * SPDX-License-Identifier: Apache-2.0
 */

const explorer = require("../Frontend/explorer");
const incomingSerial = require("../Interfaces/serial");
const incomingEthernet = require("../Interfaces/ethernet");

var portsInUse = []
module.exports = {
    //inject blockchain here
    explorerStartup: function(someDictionary, whatHappened){
        if(someDictionary.enableExplorer != false) {
                whatHappened += "\t- The NXPlorer was started and is accessible @ http://localhost:" + someDictionary.explorerPort + "\r\n"
                explorer.start(someDictionary.explorerPort, someDictionary.blockchain, someDictionary.blockchainAPILocation);
        }else {
                whatHappened += "\t- The argument enableExplorer was set to false and so the NXPlorer hasn't been started\r\n"
        }
        return whatHappened
    },
    interfaceEnabler: function(someDictionary, whatHappened){
        var whatHappened = whatHappened
        var interfacesKeys = Object.keys(someDictionary.interfaces)
        var interfaces = someDictionary.interfaces
        whatHappened += "\t- There are " + interfacesKeys.length + " interfaces found in the config. Here are their configs:\r\n"
        if(interfacesKeys.length != 0){
            for(var i =0; i<interfacesKeys.length; i++){
                var key = interfacesKeys[i]
                switch (interfaces[key].interfaceType){
                    case 'serial':
                        whatHappened += "\t\t- A serial connection with " + interfaces[key].serialName + " has been established with a baudrate of " + interfaces[key].baudrate + "\r\n"
                        incomingSerial.start(interfaces[key].serialName, interfaces[key].baudrate, someDictionary.blockchainAPILocation, someDictionary["preserveRawFiles"])
                        break
                    case 'ethernet':
                        if(!portsInUse.includes(interfaces[key].ethernetPort)){
                            whatHappened += "\t\t- A RAW TCP server was started and is accessible @ http://localhost:" + interfaces[key].ethernetPort + "\r\n"
                            portsInUse.push(interfaces[key].ethernetPort)
                            incomingEthernet.start(interfaces[key].ethernetPort, someDictionary["preserveRawFiles"])
                        } else {
                            console.log('this port is already in use:' + interfaces[key].ethernetPort)
                        }
                        break
                    default:
                        whatHappened += "\t\t- A wrong interface has been entered. Available interface are 'serial', 'ethernet' and 'all'. Exiting"
                        process.exit()
                        break
                }
            }
            whatHappened += "\t\t- All the interface ports are now waiting for incoming messages...\r\n"
        }else{
            whatHappened += "\t\t- no interfaces where opened, just the explorer is active\r\n"
        }
        return whatHappened
    }
}