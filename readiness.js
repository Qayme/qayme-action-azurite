const { BlobServiceClient } = require("@azure/storage-blob");
const { QueueServiceClient } = require("@azure/storage-queue");
const { TableServiceClient } = require("@azure/data-tables");

const connectionString = "UseDevelopmentStorage=true;"
const options = {
    retryOptions: {
        maxTries: 1,
        tryTimeoutInMs: 250,
    }
};

const blobClient = BlobServiceClient.fromConnectionString(connectionString, options);
const tableClient = TableServiceClient.fromConnectionString(connectionString, options);
const queueClient = QueueServiceClient.fromConnectionString(connectionString, options);

module.exports.isReady = async () => {
    try {
        await blobClient.listContainers().next();
        console.lot("✔️ Blobs endpoint ready")

        await tableClient.listTables().next();
        console.lot("✔️ Tables endpoint ready");

        await queueClient.listQueues().next();
        console.lot("✔️ Queues endpoint ready");

        return true;
    }
    catch (ex) {
        console.log("Azurite is not ready yet, will retry in a few seconds...");

        console.log(ex);

        return false;
    }
}