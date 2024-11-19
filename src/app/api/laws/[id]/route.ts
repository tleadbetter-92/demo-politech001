import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const dataFile = path.join(process.cwd(), 'data', 'laws.json')

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id

  try {
    let laws = []
    if (fs.existsSync(dataFile)) {
      const fileContents = fs.readFileSync(dataFile, 'utf8')
      laws = JSON.parse(fileContents)
    } else {
      console.error('laws.json does not exist at:', dataFile)
      return NextResponse.json({ error: 'Data file not found' }, { status: 500 })
    }

    const law = laws.find((law: any) => law.id === id)
    if (!law) {
      return NextResponse.json({ error: 'Law not found' }, { status: 404 })
    }

    return NextResponse.json(law)
  } catch (error) {
    console.error('Error reading law data:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id

  try {
    const body = await request.json()
    let laws = []
    
    if (fs.existsSync(dataFile)) {
      const fileContents = fs.readFileSync(dataFile, 'utf8')
      laws = JSON.parse(fileContents)
    } else {
      return NextResponse.json({ error: 'Data file not found' }, { status: 500 })
    }

    const lawIndex = laws.findIndex((law: any) => law.id === id)
    if (lawIndex === -1) {
      return NextResponse.json({ error: 'Law not found' }, { status: 404 })
    }

    if (body.type === 'vote') {
      laws[lawIndex].votes[body.vote]++
    } else if (body.type === 'comment') {
      const newComment = {
        id: Date.now(),
        author: body.author,
        content: body.content,
        timestamp: new Date().toISOString()
      }
      laws[lawIndex].comments.unshift(newComment)
    }

    fs.writeFileSync(dataFile, JSON.stringify(laws, null, 2))
    return NextResponse.json(laws[lawIndex])
  } catch (error) {
    console.error('Error updating law data:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}