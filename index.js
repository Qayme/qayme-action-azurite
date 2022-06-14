const core = require('@actions/core');
const exec = require('@actions/exec');

const { waitUntil } = require('async-wait-until/dist/commonjs');
const { isReady } = require("./readiness");

async function run() {
    try {
        const startTimeout = parseInt(core.getInput('start-timeout')) * 1000;
        const imageTag = core.getInput('image-tag');

        await exec.exec(`docker run -d -p 10000:10000 -p 10001:10001 -p 10002:10002 mcr.microsoft.com/azure-storage/azurite:${imageTag}`)

        try {
            await waitUntil(
                async () => await isReady(),
                {
                    timeout: startTimeout,
                    intervalBetweenAttempts: 500
                });
        }
        catch (ex) {
            console.error("Azurite did not get ready in time. Please see the log below:");
            core.setFailed("Azurite did not get ready in time.");
        }
    }
    catch (error) {
        core.setFailed(error.message);
    }
}

run();