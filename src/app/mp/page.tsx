'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Building2, CheckCircle, XCircle, MinusCircle, Percent } from 'lucide-react'

interface Law {
  id: string
  title: string
  votes: {
    yes: number
    no: number
  }
  mpVote: 'yes' | 'no' | null
}

const laws: Law[] = [
  { id: 'BILL1', title: 'Bill 1', votes: { yes: 25, no: 10 }, mpVote: 'yes' },
  { id: 'BILL2', title: 'Bill 2', votes: { yes: 15, no: 30 }, mpVote: 'no' },
  { id: 'BILL3', title: 'Bill 3', votes: { yes: 20, no: 20 }, mpVote: null },
]

export default function MPPage() {
  const [agreedCount, setAgreedCount] = useState(0)
  const [disagreedCount, setDisagreedCount] = useState(0)
  const [noActionCount, setNoActionCount] = useState(0)
  const [agreementRate, setAgreementRate] = useState(0)

  useEffect(() => {
    let agreed = 0
    let disagreed = 0
    let noAction = 0
    let totalVotes = 0

    laws.forEach(law => {
      const totalLawVotes = law.votes.yes + law.votes.no
      if (law.mpVote === 'yes') {
        agreed += law.votes.yes
        disagreed += law.votes.no
      } else if (law.mpVote === 'no') {
        agreed += law.votes.no
        disagreed += law.votes.yes
      } else {
        noAction += totalLawVotes
      }
      totalVotes += totalLawVotes
    })

    setAgreedCount(agreed)
    setDisagreedCount(disagreed)
    setNoActionCount(noAction)
    setAgreementRate(totalVotes > 0 ? (agreed / totalVotes) * 100 : 0)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold mb-2">Your Member of Parliament</CardTitle>
          <p className="text-xl text-muted-foreground">
            <Building2 className="inline-block mr-2 h-5 w-5" />
            Barrow-in-Furness Constituency
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-48 h-48 rounded-full overflow-hidden">
              <Image
                src="/Official_portrait_of_Michelle_Scrogham_MP_crop_2.jpg"
                alt="Michelle Scrogham MP"
                fill
                className="object-cover"
                priority
              />
            </div>
            <h2 className="text-2xl font-semibold">Michelle Scrogham MP</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-background">
              <CardContent className="pt-6 text-center">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <h3 className="text-lg font-semibold mb-1">Agreed with Constituents</h3>
                <p className="text-3xl font-bold">{agreedCount}</p>
              </CardContent>
            </Card>

            <Card className="bg-background">
              <CardContent className="pt-6 text-center">
                <XCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
                <h3 className="text-lg font-semibold mb-1">Disagreed with Constituents</h3>
                <p className="text-3xl font-bold">{disagreedCount}</p>
              </CardContent>
            </Card>

            <Card className="bg-background">
              <CardContent className="pt-6 text-center">
                <MinusCircle className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                <h3 className="text-lg font-semibold mb-1">No Action</h3>
                <p className="text-3xl font-bold">{noActionCount}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-primary/5">
            <CardContent className="pt-6 text-center">
              <div className="flex items-center justify-center space-x-2">
                <Percent className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="text-lg font-semibold mb-1">Constituent Agreement Rate</h3>
                  <p className="text-4xl font-bold text-primary">{agreementRate.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}