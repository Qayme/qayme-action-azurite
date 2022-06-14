const core = require('@actions/core');
//const exec = require('@actions/exec');
const child = require("child_process");
const { waitUntil } = require('async-wait-until/dist/commonjs');

async function run() {
    try {
        const startTimeout = parseInt(core.getInput('start-timeout'));

        var tablesReady = false;
        var blobsReady = false;
        var queuesReady = false;

        // const options = {};
        // options.detached = true;

        // options.listeners = {
        //     stdout: (data) => {
        //         console.log("STDOUT: " + data);

        //         if (data.contains("Azurite Table service is successfully listening")) {
        //             tablesReady = true;
        //         }

        //         if (data.contains("Azurite Blob service is successfully listening")) {
        //             blobsReady = true;
        //         }

        //         if (data.contains("Azurite Queue service is successfully listening")) {
        //             queuesReady = true;
        //         }
        //     }
        // }

        var azuriteProcess = child.spawn('./node_modules/.bin/azurite', [], {
            detached: true,
            stdio: 'ignore',
            listeners: {

            }
        });

        azuriteProcess.stdout.on('data', (data) => {
            console.log("STDOUT: " + data);

            if (data.contains("Azurite Table service is successfully listening")) {
                tablesReady = true;
            }

            if (data.contains("Azurite Blob service is successfully listening")) {
                blobsReady = true;
            }

            if (data.contains("Azurite Queue service is successfully listening")) {
                queuesReady = true;
            }
        });

        await waitUntil(
            () => tablesReady && blobsReady && queuesReady,
            {
                timeout: startTimeout
            });

        azuriteProcess.unref();
    }
    catch (error) {
        core.setFailed(error.message);
    }
}

run();