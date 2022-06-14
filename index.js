const core = require('@actions/core');
const os = require('os');
const child = require("node:child_process");
const { waitUntil } = require('async-wait-until/dist/commonjs');
const { isReady } = require("./healthcheck");

async function run() {
    try {
        const startTimeout = 30 *1000;//parseInt(core.getInput('start-timeout')) * 1000;

        var azuriteProcess = child.spawn("node", ['./node_modules/azurite/dist/src/azurite.js'], {
            cwd: os.tmpdir(),
            detached: true,
            stdio: 'ignore',
        });

        azuriteProcess.unref();

        await waitUntil(
            async () => await isReady(),
            {
                timeout: startTimeout,
                intervalBetweenAttempts: 500
            });

    }
    catch (error) {
        core.setFailed(error.message);
    }
}

run();