import { ObjectId } from 'mongodb'

export interface Vote {
  _id: ObjectId
  userId: string
  lawId: string
  vote: 'yes' | 'no'
  createdAt: Date
}