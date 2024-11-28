require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
if (!uri) {
    console.error('Error: MONGODB_URI is not defined in .env.local');
    process.exit(1);
}

const client = new MongoClient(uri);

const sampleLaws = [
    {
        id: "BILL1",
        title: "BBC Licence Fee Non-Payment (Decriminalisation for Over-75s) Bill",
        description: "A Bill to de-criminalise the non-payment of the BBC licence fee by persons aged over seventy-five; and for connected purposes.",
        mpComment: "This bill aims to protect our elderly citizens from criminal prosecution for non-payment of the BBC licence fee. It's a step towards ensuring fair treatment of our seniors.",
        link: "https://bills.parliament.uk/bills/3645",
        votes: { yes: 0, no: 0 },
        comments: []
    },
    {
        id: "BILL2",
        title: "Artificial Intelligence (Regulation) Bill",
        description: "A Bill to make provision for the regulation of Artificial Intelligence; and for connected purposes.",
        mpComment: "As AI becomes more prevalent in our society, it's crucial that we have proper regulations in place. This bill aims to create a framework for responsible AI development and use.",
        link: "https://bills.parliament.uk/bills/3519",
        votes: { yes: 0, no: 0 },
        comments: []
    },
    {
        id: "BILL3",
        title: "Palestine Statehood (Recognition) Bill",
        description: "A Bill to make provision in connection with the recognition of the State of Palestine.",
        mpComment: "This bill addresses the complex issue of recognizing Palestine as a state. It's a step towards potentially resolving long-standing conflicts in the Middle East.",
        link: "https://bills.parliament.uk/bills/3596",
        votes: { yes: 0, no: 0 },
        comments: []
    }
];

async function run() {
    try {
        console.log('Attempting to connect to MongoDB...');
        await client.connect();
        console.log('Connected successfully to MongoDB!');

        const database = client.db('politech_demo');
        const collection = database.collection('laws');

        console.log('Clearing existing data...');
        await collection.deleteMany({});

        console.log('Inserting sample laws...');
        const result = await collection.insertMany(sampleLaws);
        console.log(`${result.insertedCount} documents were inserted.`);

        const count = await collection.countDocuments();
        console.log(`Total documents in collection: ${count}`);

        const laws = await collection.find({}).toArray();
        console.log('Inserted laws:', laws);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.close();
        console.log('Connection closed');
    }
}

run().catch(console.dir);