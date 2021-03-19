/* Copyright 2019 NXP
 * SPDX-License-Identifier: Apache-2.0
 */

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
            helpflag: false, 
            confFlag: false,
            configFile: "",
            preserveRawFiles: false
        }

module.exports = {
    parse: function(arguments){
        for (let i = 0; i < arguments.length; i++) {  
            if(arguments[i] == "--help" || arguments[i] == "-h"){
                var helpString = "This is the help menu for NXPlorer\r\n\r\n"
                helpString += "Command overview:\r\n"

                helpString += "\t-h, --help:\r\n"
                helpString += "\t\tThis will display the help menu\r\n\r\n"

                helpString += "\t-xp, --explorerport: Default=5000\r\n"
                helpString += "\t\tThis will change the port on which the NXPlorer interface will be ran.\r\n\r\n"

                helpString += "\t-ep, --ethernetport: Default=4444\r\n"
                helpString += "\t\tThis will change the port on which the raw tcp server will be ran.\r\n"
                helpString += "\t\tKeep in mind that this needs to be changed in the code of the boards \r\n\r\n"

                helpString += "\t-it, --interfacetype: Default=serial\r\n"
                helpString += "\t\tThis will change the interface on which you have connected the device\r\n"
                helpString += "\t\tPossible choices: ethernet, serial\r\n\r\n"

                helpString += "\t-sn, --serialname: Default=/dev/ttyACM1\r\n"
                helpString += "\t\tIf you have changed the interface to serial, this will be the serial interface on which will be listened.\r\n\r\n"   

                helpString += "\t-sr, --serialrate: Default=115200\r\n"
                helpString += "\t\tIf you have changed the interface to serial, this will be the serial rate (baudrate) that will be used.\r\n\r\n"   
                
                helpString += "\t-nx, --enableexplorer: Default=true\r\n"
                helpString += "\t\tWhen set to true, it won't start the NXPlorer interface\r\n\r\n"

                helpString += "\t-pr, --preserveraw: Default=false\r\n"
                helpString += "\t\tWhen set to true, it won't delete the raw files created\r\n"
                helpString += "\t\tWarning: please not that this can take up a lot of space in production\r\n\r\n"

                helpString += "\t-c, --config:\r\n"
                helpString += "\t\tThis will take a json f ile as input and will use it as config for setting up everything\r\n\r\n"

                console.log(helpString)
                argDict["helpflag"] = true
            }
        }
        if(argDict["helpflag"] == false){
            for (let j = 0; j < arguments.length; j++) { 
                if(arguments[j] == "-c" || arguments[j] == "--config"){
                    argDict["confFlag"] = true
                    argDict["configFile"] = arguments[j+1]
                }
            }
            if(argDict["confFlag"] != true){
                for (let j = 0; j < arguments.length; j++) {
                    if(arguments[j] == "-xp" || arguments[j] == "--explorerport"){
                        argDict["explorerPort"] = parseInt(arguments[j+1])
                    }

                    else if(arguments[j] == "-ep" || arguments[j] == "--ethernetport"){
                        argDict["interfaces"]["1"].ethernetPort = parseInt(arguments[j+1])
                    }

                    else if(arguments[j] == "-it" || arguments[j] == "--interfacetype"){
                        //this code could bring some errors, should be replaced after the while loop has finished.
                        //when specifying 2 interface, it deletes both -it serial -> deletes ethernet -it ethernet -> deletes serial
                        //when you delete say ethernet and then try set the ethernetPort variable, there will be an error because it doesn't exist
                        if(arguments[j+1].toLowerCase() == "serial"){
                            delete argDict["interfaces"]["1"]
                        }else {
                            delete argDict["interfaces"]["0"]
                        }
                    }
                    else if(arguments[j] == "-sn" || arguments[j] == "--serialname"){
                        argDict["interfaces"]["0"].serialName = arguments[j+1]
                    }

                    else if(arguments[j] == "-sr" || arguments[j] == "--serialrate"){
                        argDict["interfaces"]["0"].baudrate = parseInt(arguments[j+1])
                    }

                    else if(arguments[j] == "-ex" || arguments[j] == "--enableexplorer"){
                        argDict["enableExplorer"] = (arguments[j+1] == "true" ? true : false)
                    }
                    else if(arguments[j] == "-pr" || arguments[j] == "--preserveraw"){
                        argDict["preserveRawFiles"] = (arguments[j+1] == "true" ? true : false)
                    }
                }
            }
        }
        return argDict
    }
}   