import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const laws = [
  {
    id: "BILL1",
    title: "BBC Licence Fee Non-Payment (Decriminalisation for Over-75s) Bill",
    description: "A Bill to de-criminalise the non-payment of the BBC licence fee by persons aged over seventy-five; and for connected purposes.",
  },
  {
    id: "BILL2",
    title: "Artificial Intelligence (Regulation) Bill",
    description: "A Bill to make provision for the regulation of Artificial Intelligence; and for connected purposes.",
  },
  {
    id: "BILL3",
    title: "Palestine Statehood (Recognition) Bill",
    description: "A Bill to make provision in connection with the recognition of the State of Palestine.",
  },
]

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">UK Law Discussion Platform</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {laws.map((law) => (
          <Card key={law.id}>
            <CardHeader>
              <CardTitle>{law.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">{law.description}</CardDescription>
              <Button asChild>
                <Link href={`/laws/${law.id}`}>View Details</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}