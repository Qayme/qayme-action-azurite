const core = require('@actions/core');
const os = require('os');
const child = require("node:child_process");
const { waitUntil } = require('async-wait-until/dist/commonjs');
const { isReady } = require("./healthcheck");

const fs = require('node:fs');
var path = require('path');

async function run() {
    try {
        const startTimeout = parseInt(core.getInput('start-timeout')) * 1000;

        const out = fs.openSync('./azurite.log', 'a');
        const err = fs.openSync('./azurite.log', 'a');

        const azuritePath = path.join(process.cwd(), 'node_modules/azurite/dist/src/azurite.js');

        var azuriteProcess = child.spawn("node", [azuritePath], {
            cwd: os.tmpdir(),
            detached: true,
            stdio: ['ignore', out, err],
        });

        try {
            await waitUntil(
                async () => await isReady(),
                {
                    timeout: startTimeout,
                    intervalBetweenAttempts: 500
                });

            azuriteProcess.unref();
        }
        catch (ex) {
            console.error("Azurite did not get ready in time. Please see the log below:");
            console.error(fs.readFileSync("./azurite.log", { encoding: 'utf-8' }));

            core.setFailed("Azurite did not get ready in time.");
        }
    }
    catch (error) {
        core.setFailed(error.message);
    }
}

run();