#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const child_process_1 = require("child_process");
const run = () => {
    const program = new commander_1.Command();
    program
        .version(require('../package.json').version, '-v, --version', 'Output the current version.')
        .usage('<command> [options]')
        .helpOption('-h, --help', 'Output usage information.');
    program.command('generate <schematic>').action((schematic) => {
        try {
            const runner = require.resolve('@angular-devkit/schematics-cli/bin/schematics.js', {
                paths: module.paths
            });
            const child = child_process_1.spawn('node', [`"${runner}"`, '@uminily/schematics:feature'], {
                cwd: process.cwd(),
                stdio: 'inherit',
                shell: true
            });
            //child.stdout!.on('data', data => data.toString().replace(/\r\n|\n/, ''))
            child.on('close', code => {
                if (code === 0) {
                }
                else {
                    console.error('error');
                }
            });
        }
        catch {
            throw new Error("'schematics' binary path could not be found!");
        }
    });
    program.parse(process.argv);
};
run();
//# sourceMappingURL=umi.js.map