/* Copyright 2019 - 2021 NXP
 * SPDX-License-Identifier: Apache-2.0
 */

const yargs = require('yargs')
module.exports = {
    parse: function(){
        yargs
        .version(false)
        .usage('usage: $0 <command>')
        .command(
            'none',
            'Use no interfaces',
            function (sub){
                sub
                .usage('usage: $0 none [options]')
                .option('x', {
                    alias: 'explorerport',
                    description: 'Change the NXPlorer port',
                    default: 5000,
                    type: 'number'
                })
                .option('n', {
                    alias: 'enableexplorer',
                    description: 'When set to false, it wil not start the NXPlorer interface',
                    default: true,
                    type: 'boolean'
                })
                .option('c', {
                    alias: 'blockchain',
                    description: 'Blockchain to use',
                    default: "sawtooth",
                    type: 'string',
                    choices: ['sawtooth']
                })
                .option('l', {
                    alias: 'blockchainAPILocation',
                    description: "Location of the blockchain",
                    default: "http://127.0.0.1:8008",
                    type: 'string'
                })
                .wrap(sub.terminalWidth())
                .help('h')
                .alias('h', 'help')
            } 
        )
        .command(
            'serial',
            'Use serial as interface type',
            function (sub){
                sub
                .usage('usage: $0 serial [options]')
                .option('x', {
                    alias: 'explorerport',
                    description: 'Change the NXPlorer port',
                    default: 5000,
                    type: 'number'
                })
                .option('n', {
                    alias: 'enableexplorer',
                    description: 'When set to false, it wil not start the NXPlorer interface',
                    default: true,
                    type: 'boolean'
                })
                .option('r', {
                    alias: 'preserveraw',
                    description: 'When set to true, it wil not delete the raw files created',
                    default: false,
                    type: 'boolean'
                })
                .option('p', {
                    alias: 'serialname',
                    description: 'Name of the serial port',
                    type: 'string',
                    default: '/dev/ttyACM1'
                })
                .option('b', {
                    alias: 'baudrate',
                    description: 'Baudrate of the serial port',
                    default: 115200,
                    type: 'number'
                })
                .option('c', {
                    alias: 'blockchain',
                    description: 'Blockchain to use',
                    default: "sawtooth",
                    type: 'string',
                    choices: ['sawtooth']
                })
                .option('l', {
                    alias: 'blockchainAPILocation',
                    description: "Location of the blockchain",
                    default: "http://127.0.0.1:8008",
                    type: 'string'
                })
                .wrap(sub.terminalWidth())
                .help('h')
                .alias('h', 'help')
            } 
        )
        .command(
            'ethernet',
            'Use ethernet as interface type',
            function (sub){
                sub
                .usage('usage: $0 ethernet [options]')
                .option('x', {
                    alias: 'explorerport',
                    description: 'Change the NXPlorer port',
                    default: 5000,
                    type: 'number'
                })
                .option('n', {
                    alias: 'enableexplorer',
                    description: 'When set to false, it wil not start the NXPlorer interface',
                    default: true,
                    type: 'boolean'
                })
                .option('r', {
                    alias: 'preserveraw',
                    description: 'When set to true, it wil not delete the raw files created',
                    default: false,
                    type: 'boolean'
                })
                .option('e', {
                    alias: 'ethernetport',
                    description: 'Change the ethernet port',
                    default: 4444,
                    type: 'number'
                })
                .option('c', {
                    alias: 'blockchain',
                    description: 'Blockchain to use',
                    default: "sawtooth",
                    type: 'string',
                    choices: ['sawtooth']
                })
                .option('l', {
                    alias: 'blockchainAPILocation',
                    description: "Location of the blockchain",
                    default: "http://127.0.0.1:8008",
                    type: 'string'
                })
                .wrap(sub.terminalWidth())
                .help('h')
                .alias('h', 'help')
            }
        )
        .command(
            'multi',
            'Use multiple interfaces using a config',
            function (sub){
                sub
                .usage('usage: $0 multi [options]')
                .option('c', {
                    alias: 'config',
                    description: 'Use a json file for configuration',
                    default: './example_config.json',
                    type: 'string'
                })
                .wrap(sub.terminalWidth())
                .help('h')
                .alias('h', 'help')

            }
        )
        .wrap(yargs.terminalWidth())
        .demandCommand(1,1, 'You need atleast one command', 'You can only set one command')
        .strict()
        .help('h')
        .alias('h', 'help')
        .showHelpOnFail(false, 'specify -h for more info')
        var argv = yargs.argv
        return argv
    }
}