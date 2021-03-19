/* Copyright 2019 NXP
 * SPDX-License-Identifier: Apache-2.0
 */

const fs = require('fs')
module.exports = {
    parseConfig: function(configFilePath){
        var raw = fs.readFileSync(configFilePath)
        var config
        try {
            config = JSON.parse(raw)
        } catch (error){
            console.log("Something went wrong at parsing the json input config, JSON.parse gave this error:")
            console.log("\t" + error)
            process.exit()
        }
        return config
    }
}