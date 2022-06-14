const core = require('@actions/core');
const exec = require('@actions/exec');
const { waitUntil } = require('async-wait-until/dist/commonjs');

async function run() {
    try {
        const startTimeout = parseInt(core.getInput('start-timeout'));

        var tablesReady = false;
        var blobsReady = false;
        var queuesReady = false;

        const options = {};

        options.listeners = {
            stdout: (data) => {
                if (data.contains("Azurite Table service is successfully listening")) {
                    tablesReady = true;
                }

                if (data.contains("Azurite Blob service is successfully listening")) {
                    blobsReady = true;
                }

                if (data.contains("Azurite Queue service is successfully listening")) {
                    queuesReady = true;
                }
            }
        }

        exec.exec('./node_modules/.bin/azurite');

        await waitUntil(
            () => tablesReady && blobsReady && queuesReady,
            {
                timeout: startTimeout
            });
    }
    catch (error) {
        core.setFailed(error.message);
    }
}

run();