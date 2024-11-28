require('dotenv').config({ path: '.env.local' })
const { MongoClient } = require('mongodb')

const uri = process.env.MONGODB_URI
if (!uri) {
  console.error('Error: MONGODB_URI is not defined in .env.local')
  process.exit(1)
}

async function testConnection() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    console.log('Successfully connected to MongoDB')
    const db = client.db()
    const collections = await db.listCollections().toArray()
    console.log('Available collections:', collections.map(c => c.name))
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
  } finally {
    await client.close()
  }
}

testConnection()