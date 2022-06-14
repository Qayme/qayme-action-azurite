const { BlobServiceClient } = require("@azure/storage-blob");
const { QueueServiceClient } = require("@azure/storage-queue");
const { TableServiceClient } = require("@azure/data-tables");

const connectionString = "UseDevelopmentStorage=true;"

const getRandomName = () => {
    return (Math.random() + 1).toString(36).substring(7);
}

test('Verify blob endpoint is running', async () => {
    const blobClient = BlobServiceClient.fromConnectionString(connectionString);

    await blobClient.createContainer(getRandomName());
});

test('Verify table endpoint is running', async () => {
    const tableClient = TableServiceClient.fromConnectionString(connectionString);
    
    await tableClient.createTable(getRandomName());
});

test('Verify queue endpoint is running', async () => {
    const queueClient = QueueServiceClient.fromConnectionString(connectionString);
    
    await queueClient.createQueue(getRandomName());
});