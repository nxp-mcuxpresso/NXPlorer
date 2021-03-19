/* Copyright 2019 - 2021 NXP
 * SPDX-License-Identifier: Apache-2.0
 */

//this will run our own app
const Explorer = require('express');
const app = Explorer();
const cbor = require('cbor')
const protobuf = require('sawtooth-sdk/protobuf')
const protobufjs = require('protobufjs')

//moved here to prevent memory leak, this will only load once now
var id = protobufjs.loadSync("identities.proto")
var se = protobufjs.loadSync("settings.proto")
var IdentityPayload = id.lookupType("IdentityPayload");
var SettingsPayload = se.lookupType("SettingsPayload");
var SettingProposal = se.lookupType("SettingProposal");
var SettingVote = se.lookupType("SettingVote");

//for making requests
const http = require('http');

const path = "./Frontend/"
var port;
var chain;
var API;

//This is for the pug file rendering
app.set('view engine', 'pug')
//This changes the default view directory
app.set('views', 'Templates')


//ALL INDEX
app.get("/", function(req, res) {
    res.render('index', {portvalue: port, blockchain: chain, blockchainAPILocation: API})
});

//ALL TRANSACTIONS
app.get("/transactions", function(req, res) {
    if(chain =='sawtooth'){
        res.render('transactions', {portvalue: port, blockchain: chain, blockchainAPILocation: API})
    }else{
        res.send("this is only supported by sawtooth blockchain")
    }
});

//ALL BATCHES
app.get("/batches", function(req, res){
    if(chain =='sawtooth'){
        res.render("batches", {portvalue: port, blockchain: chain, blockchainAPILocation: API})
    }else{
        res.send("this is only supported by sawtooth blockchain")
    }
})


//ALL BLOCKS
app.get("/blocks", function(req, res){
    res.render("blocks", {portvalue: port, blockchain: chain, blockchainAPILocation: API})
})

//JAVASCRIPT
app.get("/dynamic.js", function(req, res){
    res.sendFile('dynamic.js', {root: path})
})

//CSS
app.get("/styling.css", function(req, res){
    res.sendFile('styling.css', {root: path})
})

//LOGO
app.get("/nxp-logo.svg", function(req, res){
    res.sendFile('nxp-logo.svg', {root: path})
})
app.get("/nxplorer-white.svg", function(req, res){
    res.sendFile('nxplorer-white.svg', {root: path})
})

//API CALLS LIST

var  errorObj = {"error": "Something went wrong calling the api"}

app.get("/api/transactions", function(req, res){
    if(chain == 'sawtooth'){
        http.get(API + '/transactions', (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });

            resp.on('end', () => {
                arr = JSON.parse(data).data
                
                for (var i = 0; i < arr.length; i++){
                    var fam = arr[i].header.family_name
                    var pay_enc = arr[i].payload
                    var dec = Buffer.from(pay_enc, 'base64')
                    arr[i]['payload_encoded'] = pay_enc
                    if(fam == 'sawtooth_identity'){
                        var test = IdentityPayload.decode(dec)
                        if(test.type == 1){
                            var policy = protobuf.Policy.decode(test.data)
                            arr[i]['payload_decoded'] = JSON.stringify(policy)
                        } else if(test.type == 2){
                            var role = protobuf.Role.decode(test.data)
                            arr[i]['payload_decoded'] = JSON.stringify(role)
                        }
                        
                    }
                    else if(fam == 'sawtooth_settings'){
                        var test = SettingsPayload.decode(dec)
                        if (test.action == 1){
                            var proposal = SettingProposal.decode(test.data)
                            arr[i]['payload_decoded'] = JSON.stringify(proposal)
                        } else if(test.action == 2){
                            var vote = SettingVote.decode(test.data)
                            arr[i]['payload_decoded'] = JSON.stringify(vote)
                        }
                    }
                    else{
                        var decoded = cbor.decode(dec)
                        arr[i]['payload_decoded'] = JSON.stringify(decoded)
                    }
                }
                res.send(arr)
            });
            resp.on('error', (error) => {
                res.send(errorObj)
            })
        }).on('error', (error) => {
            res.send(errorObj)
        })
    } /*else {
        http.get(API + '/notImplementedYet', (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });

            resp.on('end', () => {
                res.send(JSON.parse(data).data)
            });
            resp.on('error', (error) => {
                res.send(errorObj)
            })
        }).on('error', (error) => {
            res.send(errorObj)
        })
    }*/
    
})

app.get("/api/batches", function(req, res){
    if(chain == 'sawtooth'){
        http.get(API + '/batches', (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });

            resp.on('end', () => {
                res.send(JSON.parse(data).data)
            });
            resp.on('error', (error) => {
                res.send(errorObj)
            })
        }).on('error', (error) => {
            res.send(errorObj)
        })
    }
})
    
app.get("/api/sawtooth", function(req, res){
    if(chain == 'sawtooth'){
        http.get(API + '/state', (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });

            resp.on('end', () => {
                arr = []
                parsed = JSON.parse(data).data
                if(parsed)
                for(var i = 0; i < parsed.length; i++){
                    addr = parsed[i].address
                    var dec = Buffer.from(parsed[i].data, 'base64');
                    if(addr.slice(0, 6) == '000000'){
                        //if the address starts with 000000 then it comes from the settings transaction processor
                        var settingEntries = protobuf.Setting.decode(dec).entries
                        for(var se in settingEntries){
                            var settingEntry = settingEntries[se]
                            var obj = {}
                            obj[settingEntry.key] = settingEntry.value
                            arr.push(obj)
                        }
                    }else if(addr.slice(0, 6) == '00001d'){
                        //if the address starts with 00001d then it comes from the identity transaction processor
                        //if the next 2 chars in the addres are 00 then it is about a policy 
                        //if the next 2 chars in the addres are 01 then it is about a role 
                        var type = addr.slice(6, 8)
                        if(type == '00'){
                            var policies = protobuf.PolicyList.decode(dec).policies
                            for(var p in policies){
                                var policy = policies[p]
                                var entries = policy.entries
                                for(var e in entries){
                                    var entry = entries[e]
                                    var etype = ''
                                    if(entry.type == 1){
                                        etype = 'PERMIT_KEY'
                                    } else {
                                        etype = 'DENY_KEY'
                                    }
                                    var obj = {}
                                    obj[policy.name + " entry " + e] = etype + ' ' + entry.key
                                    arr.push(obj) 
                                } 

                            }
                        }else {
                            var roles = protobuf.RoleList.decode(dec).roles
                            for(var r in roles){
                                var role = roles[r]
                                var obj = {}
                                obj[role.name + " entry " + r] = 'role ' + role.name + ' got assigned ' + role.policyName + ' as a policy'
                                arr.push(obj)
                            }
                        }
                    } else{
                        arr.push(cbor.decode(dec))
                    } 
                }
                res.send(arr)
            });
            resp.on('error', (error) => {
                res.send(errorObj)
            })
        }).on('error', (error) => {
            res.send(errorObj)
        })
    }
})

app.get("/api/blocks", function(req, res){
    if(chain == 'sawtooth'){
        http.get(API + '/blocks', (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });

            resp.on('end', () => {
                res.send(JSON.parse(data).data)
            });
            resp.on('error', (error) => {
                res.send(errorObj)
            })
        }).on('error', (error) => {
            res.send(errorObj)
        })
    } 
})

module.exports = {
    start: function(xplrport, blockchain, blockchainAPILocation){
        chain = blockchain
        API = blockchainAPILocation
        app.listen(xplrport, function() {
            port = xplrport
        });
    }
}