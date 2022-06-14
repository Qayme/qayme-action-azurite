const core = require('@actions/core');
const child = require("child_process");
const { waitUntil } = require('async-wait-until/dist/commonjs');
const { BlobServiceClient } = require("@azure/storage-blob");
const { QueueServiceClient } = require("@azure/storage-queue");
const { TableServiceClient } = require("@azure/data-tables");

const connectionString = "UseDevelopmentStorage=true;"
const blobClient = BlobServiceClient.fromConnectionString(connectionString);
const tableClient = TableServiceClient.fromConnectionString(connectionString);
const queueClient = QueueServiceClient.fromConnectionString(connectionString);

async function run() {
    try {
        const startTimeout = parseInt(core.getInput('start-timeout'));

        var azuriteProcess = child.spawn('./node_modules/.bin/azurite', [], {
            detached: true,
            stdio: 'ignore',
        });

        await waitUntil(
            async () => await isReady(),
            {
                timeout: startTimeout
            });

        azuriteProcess.unref();
    }
    catch (error) {
        core.setFailed(error.message);
    }
}

async function isReady() {
    try
    {
        await tableClient.listTables().next();
        await blobClient.listContainers().next();
        await queueClient.listQueues().next();

        return true;
    }
    catch(ex)
    {
        return false;
    }
}

run();