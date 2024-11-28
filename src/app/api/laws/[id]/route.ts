import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

interface Law {
  id: string
  title: string
  description: string
  mpComment: string
  link: string
  votes: {
    yes: number
    no: number
  }
  comments: Array<{
    id: string
    author: string
    content: string
    timestamp: string
  }>
}

interface Vote {
  _id: ObjectId
  userId: string
  lawId: string
  vote: 'yes' | 'no'
  createdAt: Date
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db("politech_demo")
    
    const law = await db.collection<Law>("laws").findOne({ id: params.id })
    
    if (!law) {
      return NextResponse.json(
        { error: 'Law not found' },
        { status: 404 }
      )
    }

    const userId = request.nextUrl.searchParams.get('userId')
    let userVote = null

    if (userId) {
      const vote = await db.collection<Vote>("votes").findOne({
        userId: userId,
        lawId: params.id
      })
      if (vote) {
        userVote = vote.vote
      }
    }

    return NextResponse.json({ ...law, userVote })
  } catch (error) {
    console.error('Error reading law data:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json() as { type: string; vote?: 'yes' | 'no'; author?: string; content?: string; userId: string }
    const client = await clientPromise
    const db = client.db("politech_demo")
    
    const law = await db.collection<Law>("laws").findOne({ id: params.id })
    if (!law) {
      return NextResponse.json(
        { error: 'Law not found' },
        { status: 404 }
      )
    }

    if (body.type === 'vote' && body.vote && body.userId) {
      const existingVote = await db.collection<Vote>("votes").findOne({
        userId: body.userId,
        lawId: params.id
      })

      if (existingVote) {
        return NextResponse.json(
          { error: 'You have already voted on this law' },
          { status: 400 }
        )
      }

      const newVote: Omit<Vote, '_id'> = {
        userId: body.userId,
        lawId: params.id,
        vote: body.vote,
        createdAt: new Date()
      }

      await db.collection<Vote>("votes").insertOne(newVote as Vote)

      const result = await db.collection<Law>("laws").findOneAndUpdate(
        { id: params.id },
        { $inc: { [`votes.${body.vote}`]: 1 } },
        { returnDocument: 'after' }
      )

      if (!result.value) {
        return NextResponse.json(
          { error: 'Failed to update vote' },
          { status: 500 }
        )
      }

      return NextResponse.json(result.value)
    } 
    
    if (body.type === 'comment' && body.author && body.content) {
      const newComment = {
        id: new ObjectId().toString(),
        author: body.author,
        content: body.content,
        timestamp: new Date().toISOString()
      }
      const result = await db.collection<Law>("laws").findOneAndUpdate(
        { id: params.id },
        { $push: { comments: { $each: [newComment], $position: 0 } } },
        { returnDocument: 'after' }
      )
      if (!result.value) {
        return NextResponse.json(
          { error: 'Failed to add comment' },
          { status: 500 }
        )
      }
      return NextResponse.json(result.value)
    }

    return NextResponse.json(
      { error: 'Invalid request type' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error updating law data:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

