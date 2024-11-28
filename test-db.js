require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
if (!uri) {
    console.error('Error: MONGODB_URI is not defined in .env.local');
    process.exit(1);
}

const client = new MongoClient(uri);

async function run() {
    try {
        console.log('Attempting to connect to MongoDB...');
        await client.connect();
        console.log('Connected successfully to MongoDB!');

        const database = client.db('politech_demo');
        console.log('Using database:', database.databaseName);

        const collection = database.collection('laws');
        console.log('Using collection:', collection.collectionName);

        const count = await collection.countDocuments();
        console.log('Number of documents in collection:', count);

        const doc = await collection.findOne();
        console.log('Sample document:', doc);

        if (count === 0) {
            console.log('The collection is empty. Let\'s insert a test document.');
            const testDoc = { title: "Test Law", description: "This is a test law" };
            const result = await collection.insertOne(testDoc);
            console.log('Inserted test document with ID:', result.insertedId);
        }
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.close();
        console.log('Connection closed');
    }
}

run().catch(console.dir);