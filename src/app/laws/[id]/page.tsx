'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ExternalLink, CheckCircle, Send, ThumbsUp, ThumbsDown, ArrowLeft } from 'lucide-react'

type Law = {
  id: string
  title: string
  description: string
  mpComment: string
  link: string
  votes: { yes: number; no: number }
  comments: { id: number; author: string; content: string; timestamp: string }[]
}

export default function LawPage() {
  const params = useParams()
  const lawId = params.id as string

  const [law, setLaw] = useState<Law | null>(null)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLaw = async () => {
      try {
        const response = await fetch(`/api/laws/${lawId}`)
        if (response.ok) {
          const data = await response.json()
          setLaw(data)
          setHasVoted(localStorage.getItem(`voted-${data.id}`) === 'true')
        } else {
          const errorData = await response.json()
          setError(errorData.error || 'Failed to fetch law data')
        }
      } catch (error) {
        console.error('Error fetching law:', error)
        setError('An error occurred while fetching the law data')
      } finally {
        setIsLoading(false)
      }
    }

    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    fetchLaw()
  }, [lawId])

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const name = (form.elements.namedItem('name') as HTMLInputElement).value
    if (email && email.includes('@') && name) {
      const newUser = { email, name }
      setUser(newUser)
      localStorage.setItem('user', JSON.stringify(newUser))
    } else {
      alert('Please enter a valid email address and name')
    }
  }

  const handleVote = async (choice: 'yes' | 'no') => {
    if (!hasVoted && law) {
      try {
        const response = await fetch(`/api/laws/${law.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'vote', vote: choice })
        })
        if (response.ok) {
          const updatedLaw = await response.json()
          setLaw(updatedLaw)
          setHasVoted(true)
          localStorage.setItem(`voted-${law.id}`, 'true')
        } else {
          const errorData = await response.json()
          setError(errorData.error || 'Failed to submit vote')
        }
      } catch (error) {
        console.error('Error submitting vote:', error)
        setError('An error occurred while submitting your vote')
      }
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim() && user && law) {
      try {
        const response = await fetch(`/api/laws/${law.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'comment',
            author: user.name,
            content: newComment.trim()
          })
        })
        if (response.ok) {
          const updatedLaw = await response.json()
          setLaw(updatedLaw)
          setNewComment('')
        } else {
          const errorData = await response.json()
          setError(errorData.error || 'Failed to submit comment')
        }
      } catch (error) {
        console.error('Error submitting comment:', error)
        setError('An error occurred while submitting your comment')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center mb-4 text-primary hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Main Page
        </Link>
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center mb-4 text-primary hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Main Page
        </Link>
        <div className="text-center text-red-500">{error}</div>
      </div>
    )
  }

  if (!law) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center mb-4 text-primary hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Main Page
        </Link>
        <div className="text-center">Law not found</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center mb-4 text-primary hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Main Page
      </Link>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center mb-4">
            {law.title}
          </CardTitle>
          <CardDescription className="text-center text-lg">
            {law.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Your MP's Comment</h2>
            <p className="text-muted-foreground">{law.mpComment}</p>
          </div>
          <div className="flex justify-center">
            <Button asChild>
              <a
                href={law.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                View Bill Details
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
          {!user ? (
            <form onSubmit={handleSignUp} className="space-y-4">
              <h3 className="text-lg font-semibold">Sign up to vote and comment</h3>
              <Input
                type="text"
                name="name"
                placeholder="Enter your name"
                required
              />
              <Input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
              />
              <Button type="submit">Sign Up</Button>
            </form>
          ) : !hasVoted ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Cast your vote</h3>
              <div className="flex justify-center space-x-4">
                <Button onClick={() => handleVote('yes')} variant="outline">
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  Vote Yes ({law.votes.yes})
                </Button>
                <Button onClick={() => handleVote('no')} variant="outline">
                  <ThumbsDown className="mr-2 h-4 w-4" />
                  Vote No ({law.votes.no})
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-2">
              <CheckCircle className="mx-auto text-green-500" size={24} />
              <p className="font-semibold">Thank you for voting!</p>
              <p>Current results: Yes ({law.votes.yes}) / No ({law.votes.no})</p>
            </div>
          )}
          {user && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Comments</h3>
              <form onSubmit={handleCommentSubmit} className="space-y-2">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                />
                <Button type="submit" className="w-full">
                  <Send className="mr-2 h-4 w-4" /> Post Comment
                </Button>
              </form>
              <div className="space-y-4">
                {law.comments.map((comment) => (
                  <Card key={comment.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Avatar>
                          <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${comment.author}`} />
                          <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{comment.author}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(comment.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <p className="mt-2">{comment.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}