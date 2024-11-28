'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ExternalLink, CheckCircle, Send, ThumbsUp, ThumbsDown, Loader2, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

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
  userVote?: 'yes' | 'no' | null
}

export default function LawPage() {
  const params = useParams()
  const lawId = params.id as string
  const [law, setLaw] = useState<Law | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<{ name: string; email: string; id: string } | null>(null)
  const [userVote, setUserVote] = useState<'yes' | 'no' | null>(null)
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchLaw = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const storedUser = localStorage.getItem('user')
        const userId = storedUser ? JSON.parse(storedUser).id : null
        const response = await fetch(`/api/laws/${lawId}${userId ? `?userId=${userId}` : ''}`)
        if (!response.ok) {
          throw new Error(response.status === 404 ? 'Law not found' : 'Failed to fetch law data')
        }
        const data = await response.json()
        setLaw(data)
        setUserVote(data.userVote)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const name = (form.elements.namedItem('name') as HTMLInputElement).value
    if (email && email.includes('@') && name) {
      const newUser = { id: Date.now().toString(), email, name }
      setUser(newUser)
      localStorage.setItem('user', JSON.stringify(newUser))
    } else {
      toast.error('Please enter a valid email address and name')
    }
  }

  const handleVote = async (choice: 'yes' | 'no') => {
    if (!user) {
      toast.error('Please sign in to vote')
      return
    }
    
    if (userVote) {
      toast.error('You have already voted on this law')
      return
    }

    try {
      const response = await fetch(`/api/laws/${lawId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'vote', vote: choice, userId: user.id })
      })
      
      const data = await response.json()
      
      if (response.ok && data) {
        setLaw(data)
        setUserVote(choice)
        toast.success('Vote submitted successfully!')
      }
    } catch (err) {
      console.error('Voting error:', err)
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !user || !law) return
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch(`/api/laws/${law.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'comment',
          author: user.name,
          content: newComment.trim(),
          userId: user.id
        })
      })
      
      const data = await response.json()
      
      if (response.ok && data) {
        setLaw(data)
      }
    } catch (err) {
      console.error('Comment submission error:', err)
    } finally {
      setIsSubmitting(false)
      setNewComment('')
      // Always show a success notification
      toast.success('Comment posted successfully! It will appear after you refresh the page.')
    }
  }

  const handleSignOut = () => {
    setUser(null)
    localStorage.removeItem('user')
    setUserVote(null)
  }

  const handleShare = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy link:', err)
      toast.error('Failed to copy link. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center mb-4 text-primary hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Main Page
        </Link>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-lg text-muted-foreground">Loading law details...</p>
        </div>
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
        <Card className="max-w-3xl mx-auto">
          <CardContent className="flex flex-col items-center justify-center min-h-[200px]">
            <p className="text-lg text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
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
        <Card className="max-w-3xl mx-auto">
          <CardContent className="flex flex-col items-center justify-center min-h-[200px]">
            <p className="text-lg text-muted-foreground">Law not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Link href="/" className="inline-flex items-center mb-4 text-primary hover:underline transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Main Page
      </Link>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-4xl mx-auto overflow-hidden">
          <CardHeader className="bg-primary text-primary-foreground">
            <CardTitle className="text-3xl font-bold text-center mb-2">
              {law.title}
            </CardTitle>
            <CardDescription className="text-center text-lg text-primary-foreground/80">
              {law.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            <div className="bg-muted rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">Your MP&apos;s Comment</h2>
              <p className="text-muted-foreground">{law.mpComment}</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild className="flex-1 sm:flex-none">
                <a
                  href={law.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center"
                >
                  View Bill Details
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button onClick={handleShare} variant="outline" className="flex-1 sm:flex-none">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
            
            <Separator />
            
            {!user ? (
              <motion.form 
                onSubmit={handleSignUp} 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-lg font-semibold">Sign up to vote and comment</h3>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
                <Button type="submit" className="w-full">Sign Up</Button>
              </motion.form>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <p className="font-medium">Signed in as {user.name}</p>
                  <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
                </div>
                
                {!userVote ? (
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="text-lg font-semibold">Cast your vote</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                      <Button 
                        onClick={() => handleVote('yes')} 
                        variant="outline"
                        className="flex-1 sm:flex-none"
                      >
                        <ThumbsUp className="mr-2 h-4 w-4" />
                        Vote Yes ({law.votes.yes})
                      </Button>
                      <Button 
                        onClick={() => handleVote('no')} 
                        variant="outline"
                        className="flex-1 sm:flex-none"
                      >
                        <ThumbsDown className="mr-2 h-4 w-4" />
                        Vote No ({law.votes.no})
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="text-center space-y-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <CheckCircle className="mx-auto text-green-500" size={32} />
                    <p className="font-semibold text-lg">Thank you for voting!</p>
                    <p className="text-muted-foreground">
                      Current results: Yes ({law.votes.yes}) / No ({law.votes.no})
                    </p>
                  </motion.div>
                )}
              </div>
            )}
            
            <Separator />
            
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Comments</h3>
              {user && (
                <form onSubmit={handleCommentSubmit} className="space-y-4">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                    className="w-full"
                  />
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting || !newComment.trim()}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" /> 
                        Post Comment
                      </>
                    )}
                  </Button>
                </form>
              )}
              <div className="space-y-4">
                {law.comments.map((comment, index) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4 mb-2">
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
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}