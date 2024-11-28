import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import clientPromise from '@/lib/mongodb'

interface Law {
  id: string
  title: string
  description: string
}

async function getLaws(): Promise<Law[]> {
  const client = await clientPromise
  const db = client.db("politech_demo")
  const laws = await db.collection<Law>("laws").find({}).toArray()
  return laws
}

export default async function Home() {
  const laws = await getLaws()

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">UK Law Discussion Platform</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {laws.map((law) => (
          <Card key={law.id}>
            <CardHeader>
              <CardTitle>{law.title}</CardTitle>
              <CardDescription>{law.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/laws/${law.id}`} className="text-primary hover:underline">
                View Details
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}