const core = require('@actions/core');
const Docker = require('dockerode');


// const os = require('os');
// const child = require("child_process");
// const fs = require('fs');
// const path = require('path');

const { waitUntil } = require('async-wait-until/dist/commonjs');
const { isReady } = require("./readiness");

async function run() {
    try {
        const startTimeout = parseInt(core.getInput('start-timeout')) * 1000;
        const imageTag = core.getInput('image-tag');

        const docker = new Docker({socketPath: '/var/run/docker.sock'});
        const image = `mcr.microsoft.com/azure-storage/azurite:${imageTag}`;

        console.log("Pull");
        await docker.pull(image);

        console.log("Create");
        var container = await docker.createContainer({
            Image: image,
            HostConfig: {
                PortBindings: {
                  "10000/tcp": [{ HostPort: "10000" }],
                  "10001/tcp": [{ HostPort: "10001" }],
                  "10002/tcp": [{ HostPort: "10002" }]
                }
              },
              ExposedPorts: {
                "10000/tcp": {},
                "10001/tcp": {},
                "10002/tcp": {}
              },
        });

        console.log("Start");
        await container.start();



        // const out = fs.openSync('./azurite.log', 'a');
        // const err = fs.openSync('./azurite.log', 'a');



        // const azuritePath = require.resolve('azurite/dist/src/azurite.js');

        // const azuritePath = path.join(process.cwd(), 'node_modules/azurite/dist/src/azurite.js');

        // var azuriteProcess = child.spawn("node", [azuritePath], {
        //     cwd: os.tmpdir(),
        //     detached: true,
        //     stdio: ['ignore', out, err],
        // });

        // try {
        //     await waitUntil(
        //         async () => await isReady(),
        //         {
        //             timeout: startTimeout,
        //             intervalBetweenAttempts: 500
        //         });

        //     azuriteProcess.unref();
        // }
        // catch (ex) {
        //     console.error("Azurite did not get ready in time. Please see the log below:");
        //     console.error(fs.readFileSync("./azurite.log", { encoding: 'utf-8' }));

        //     core.setFailed("Azurite did not get ready in time.");
        // }
    }
    catch (error) {
        core.setFailed(error.message);
    }
}

run();