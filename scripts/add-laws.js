require('dotenv').config({ path: '.env.local' })
const { MongoClient } = require('mongodb')

const uri = process.env.MONGODB_URI
if (!uri) {
  console.error('Error: MONGODB_URI is not defined in .env.local')
  process.exit(1)
}

const newLaws = [
  {
    id: 'BILL8',
    title: 'Online Safety Bill',
    description: 'A Bill to make provision for and in connection with the regulation by OFCOM of certain internet services.',
    mpComment: 'This bill aims to make the UK the safest place in the world to be online.',
    link: 'https://bills.parliament.uk/bills/3137',
    votes: { yes: 0, no: 0 },
    comments: []
  },
  {
    id: 'BILL9',
    title: 'Environment Bill',
    description: 'A Bill to make provision about targets, plans and policies for improving the natural environment.',
    mpComment: 'This bill sets ambitious new environmental targets.',
    link: 'https://bills.parliament.uk/bills/2593',
    votes: { yes: 0, no: 0 },
    comments: []
  },
  {
    id: 'BILL10',
    title: 'Police, Crime, Sentencing and Courts Bill',
    description: 'A Bill to make provision about the police and other emergency workers.',
    mpComment: 'This bill aims to overhaul the justice system.',
    link: 'https://bills.parliament.uk/bills/2839',
    votes: { yes: 0, no: 0 },
    comments: []
  },
  // Add more laws here...
]

async function addLaws() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    console.log('Connected successfully to MongoDB')

    const db = client.db('politech_demo')
    const collection = db.collection('laws')

    for (const law of newLaws) {
      const existingLaw = await collection.findOne({ id: law.id })
      if (existingLaw) {
        console.log(`Law with ID ${law.id} already exists. Skipping.`)
      } else {
        const result = await collection.insertOne(law)
        console.log(`Added new law with ID: ${law.id}`)
      }
    }

    console.log('Finished adding new laws')
  } catch (err) {
    console.error('Error:', err)
  } finally {
    await client.close()
  }
}

addLaws()