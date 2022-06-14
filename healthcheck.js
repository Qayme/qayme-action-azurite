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
        console.log("Checking if ready...");

        console.log("Tables...");
        await tableClient.listTables().next();

        console.log("Blobs...");
        await blobClient.listContainers().next();

        console.log("Queues...");
        await queueClient.listQueues().next();

        return true;
    }
    catch (ex) {
        console.log("Not ready yet: " + ex);

        return false;
    }
}