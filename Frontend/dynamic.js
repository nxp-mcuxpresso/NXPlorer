/* Copyright 2019 - 2021 NXP
 * SPDX-License-Identifier: Apache-2.0
 */

var setPort
var setPage
var setBlockchain
var setBlockchainAPILocation

function initJavascript(port, page, blockchain, blockchainAPILocation){
    setPort = port
    setPage = page
    setBlockchain = blockchain
    setBlockchainAPILocation = blockchainAPILocation
    console.log(blockchainAPILocation)
}

var getInd = new XMLHttpRequest()
var getBat = new XMLHttpRequest();
var getBlo = new XMLHttpRequest();
var getTrans = new XMLHttpRequest();
setInterval(getIndex, 1000)
setInterval(getBatches, 1000);
setInterval(getBlocks, 1000);
setInterval(getTransactions, 1000);


function getIndex() {
    if(setPage == 'index'){
        var url = "http://localhost:" + setPort
        if(setBlockchain == 'sawtooth'){
            url += "/api/sawtooth"
        } 
        getInd.open("GET", url , true)
        getInd.onreadystatechange = getIndexResult
        getInd.send(null)
    }
}


function getBatches() {
    if(setPage == 'batches'){
        getBat.open("GET", "http://localhost:" + setPort + "/api/batches", true);
        getBat.onreadystatechange = getBatchesResult;
        getBat.send(null);
    }
}

function getBlocks() {
    if(setPage == 'blocks'){
        getBlo.open("GET", "http://localhost:" + setPort + "/api/blocks", true);
        getBlo.onreadystatechange = getBlocksResult;
        getBlo.send(null);
    }
}

function getTransactions() {
    if(setPage == 'transactions'){
        getTrans.open("GET", "http://localhost:" + setPort + "/api/transactions", true);
        getTrans.onreadystatechange = getTransactionResult;
        getTrans.send(null);
    }
}

function getIndexResult() {
    if (this.readyState == 4 && this.status == 200) {
        var json = JSON.parse(this.responseText)
        if(!json["error"]){
            if(setBlockchain == 'sawtooth'){
                htmlIndexSawtooth(json)
            }
        }else{
            htmlError(json, "index")
        }
    }
}

function getBatchesResult() {
    if (this.readyState == 4 && this.status == 200) {
        var json = JSON.parse(this.responseText)
        if(!json["error"]){
            htmlBatch(json)
        }else{
            htmlError(json, "batches")
        }
    }
}

function getBlocksResult() {
    if (this.readyState == 4 && this.status == 200) {
        var json = JSON.parse(this.responseText)
        if(!json["error"]){
            if(setBlockchain == 'sawtooth'){
                htmlBlockSawtooth(json)
            }            
        }else{
            htmlError(json, "blocks")
        }
    }
}

function getTransactionResult() {
    if (this.readyState == 4 && this.status == 200) {
        var json = JSON.parse(this.responseText)
        if(!json["error"]){
            htmlTransaction(json)
        }else{
            htmlError(json, "transactions")
        }
    }
}

function htmlIndexSawtooth(arr){
    var out = ""
    for (var i = 0; i < arr.length; i++){
        name = Object.keys(arr[i])[0]
        value = Object.values(arr[i])[0]
        out += 
        "<div class='mainblock' style='display: inline-block;' id='" + name+ "'>" +
            "<h3>Name: " + name + "</h3>" + 
            "<h3>Value: " + value + "</h3>" + 
        "</div>"
    }
    document.getElementById("index").innerHTML = out;

}

function htmlBatch(arr) {
    var out = ""
    for (var i = 0; i < arr.length; i++){
        out += 
        "<div class='mainblock' id='" + arr[i].header_signature+ "'>" +
            "<h3>Batch ID: " + arr[i].header_signature.substring(0, 8) + "</h3>" + 
            "<div class='subblock_blue' id='header_info'>" + 
                "<h3>Header:</h3>" +
                "<h4>Signer public key: " + arr[i].header.signer_public_key.substring(0, 8) + "</h4>" + 
                "<h4>Transaction id(s):</h4>" + 
                "<table>" +
                    "<tr>" +
                        "<th>Transaction ID</th>" + 
                        "<th>Transaction Info url</th>" + 
                    "<tr>"
                    for(var j = 0; j < arr[i].header.transaction_ids.length; j++){
                        out+=
                    "<tr>" +
                        "<td>" + arr[i].header.transaction_ids[j].substring(0, 8) + "</td>" + 
                        "<td><a href='"+ setBlockchainAPILocation +"/transactions/" + arr[i].header.transaction_ids[j] + "'>Check transaction info</a></td>" + 
                    "<tr>" 
                    }
            out+=

                "</table>" +  
            "</div>" +  
        "</div>"
    }
    document.getElementById("batches").innerHTML = out;
}

function htmlBlockSawtooth(arr) {
    var out = ""
    for (var i = 0; i < arr.length; i++){
        out += 
        "<div class='mainblock' id='" + arr[i].header_signature+ "'>" +
            "<h3>Block ID: " + arr[i].header_signature.substring(0, 8) + "</h3>" + 
            "<div class='subblock_blue' id='batch_info'>" + 
                "<h3>Batch(es):</h3>" + 
                "<table>" +
                    "<tr>" +
                        "<th>Batch ID</th>" + 
                        "<th>Batch Info url</th>" + 
                    "<tr>"
                    for(var j = 0; j < arr[i].batches.length; j++){
                        out+=
                    "<tr>" +
                        "<td>" + arr[i].batches[j].header_signature.substring(0, 8) + "</td>" + 
                        "<td><a href='"+ setBlockchainAPILocation +"/batches/" + arr[i].batches[j].header_signature + "'>Check batch info</a></td>" + 
                    "<tr>" 
                    }
            out+=

                "</table>" +  
            "</div>" + 
            "<div class='subblock_green' id='block_info'>" + 
                "<h3>Block info:</h3>" + 
                "<table>" +
                    "<tr>" +
                        "<th>block_num</th>" + 
                        "<th>consensus</th>" + 
                        "<th>signer_public_key</th>" + 
                        "<th>state_root_hash</th>" + 
                    "<tr>" + 
                    "<tr>" +
                        "<td>" + arr[i].header.block_num + "</td>" + 
                        "<td>" + arr[i].header.consensus.substring(0, 8) + "</td>" + 
                        "<td>" + arr[i].header.signer_public_key.substring(0, 8) + "</td>" + 
                        "<td>" + arr[i].header.state_root_hash.substring(0, 8) + "</td>" + 
                    "<tr>" +
                "</table>" +        
            "</div>" +
            "<h3>Previous block ID: " + arr[i].header.previous_block_id.substring(0, 8) + "</h3>" + 
        "</div>"
    }
    document.getElementById("blocks").innerHTML = out;
}

function htmlTransaction(arr) {
    var out = ""
    for (var i = 0; i < arr.length; i++){
        out += 
        "<div class='mainblock' style='word-wrap: break-word' id='" + arr[i].header_signature+ "'>" +
            "<h3>Transaction ID: " + arr[i].header_signature.substring(0, 8) + "</h3>" + 
            "<div class='subblock_blue' id='header_info'>" + 
                "<h3>Header:</h3>" + 
                "<h4>Batcher public key: " + arr[i].header.batcher_public_key.substring(0, 8) + "</h4>" + 
                "<h4>Family name: " + arr[i].header.family_name + ", version: " + arr[i].header.family_version + "</h4>" + 
                "<h4>Inputs: </h4>" + 
                "<ul>"
                    for(var j = 0; j < arr[i].header.inputs.length; j++){
                        out+=
                    "<li>" +
                        arr[i].header.inputs[j].substring(0,8) + 
                    "</li>" 
                    }
            out+=
                "</ul>" +  
                "<h4>Nonce: " + arr[i].header.nonce + "</h4>" +
                "<h4>Outputs: </h4>" + 
                "<ul>"
                    for(var j = 0; j < arr[i].header.outputs.length; j++){
                        out+=
                    "<li>" +
                        arr[i].header.outputs[j].substring(0,8) + 
                    "</li>" 
                    }
            out+=
                "</ul>" + 
                "<h4>Payload sha512: " + arr[i].header.payload_sha512.substring(0, 8) + "</h4>" + 
                "<h4>Signer public key: " + arr[i].header.signer_public_key.substring(0, 8) + "</h4>" + 
            "</div>" + 
            "<h3>Payload encoded: " + arr[i].payload_encoded + "</h3>" + 
            
            "<h3>Payload decoded: " + arr[i].payload_decoded + "</h3>" + 
        "</div>"
        console.log(arr[i].type)
        console.log(arr[i].payload_decoded)
        
    }
    document.getElementById("transactions").innerHTML = out;
}


function htmlError(arr, page) {
    var out = ""
    out += "<table><tr><th>error</th><th>message</th></tr>"
    out += "<tr><td>error</td><td>" + arr["error"] +  "</td></tr>"
    out += "</table>"
    document.getElementById(page).innerHTML = out;
}