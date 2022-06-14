const core = require('@actions/core');
const exec = require('@actions/exec');

const { waitUntil } = require('async-wait-until/dist/commonjs');
const { isReady } = require("./readiness");

async function run() {
    try {
        const startTimeout = parseInt(core.getInput('start-timeout')) * 1000;
        const imageTag = core.getInput('image-tag');

        const fullImageName = `mcr.microsoft.com/azure-storage/azurite:${imageTag}`

        // This is to avoid countint the time to pull the image into the start timeout
        await exec.exec(`docker pull ${fullImageName}`);
        await exec.exec(`docker run -d -p 10000:10000 -p 10001:10001 -p 10002:10002 --name azurite ${fullImageName} azurite --blobHost 0.0.0.0 --tableHost 0.0.0.0 --queueHost 0.0.0.0`);

        try {
            await waitUntil(
                async () => await isReady(),
                {
                    timeout: startTimeout,
                    intervalBetweenAttempts: 2000
                });
        }
        catch (ex) {
            console.log("EX");
            console.log(ex);

            core.setFailed("Azurite did not get ready in time.");
        }
    }
    catch (error) {
        core.setFailed(error.message);
    }
}

run();