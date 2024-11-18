'use client'

import { useState, useEffect } from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, LogOut, Sparkles, Lock, History, Star, Brain, Code, Wand2 } from 'lucide-react'
import { format } from "date-fns"

interface Prompt {
  id: string
  originalText: string
  enhancedText: string
  createdAt: string
}

export default function PromptEnhancer() {
  const { data: session } = useSession()
  const [prompt, setPrompt] = useState("")
  const [enhancedPrompt, setEnhancedPrompt] = useState("")
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [history, setHistory] = useState<Prompt[]>([])
  const [error, setError] = useState("")
  const [anonymousPromptCount, setAnonymousPromptCount] = useState(0)

  useEffect(() => {
    if (session?.user) {
      fetchHistory()
    }
  }, [session])

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/prompts')
      if (!response.ok) throw new Error('Failed to fetch history')
      const data = await response.json()
      setHistory(data)
    } catch (error) {
      console.error('Error fetching history:', error)
      setError('Failed to load prompt history')
    }
  }

  const enhancePrompt = async () => {
    if (!session?.user && anonymousPromptCount >= 3) {
      setError("You've reached the limit of 3 prompts. Sign in to continue enhancing prompts!")
      return
    }

    try {
      setIsEnhancing(true)
      setError("")
      
      const response = await fetch('/api/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) throw new Error('Enhancement failed')
      
      const data = await response.json()
      setEnhancedPrompt(data.prompt.enhancedText)
      
      if (!session?.user) {
        setAnonymousPromptCount(prev => prev + 1)
      } else {
        await fetchHistory()
      }
    } catch (error) {
      console.error('Enhancement error:', error)
      setError('Failed to enhance prompt')
    } finally {
      setIsEnhancing(false)
    }
  }

  return (
    <div className="min-h-screen bg-ai-dark">
      <div className="fixed inset-0 bg-gradient-to-br from-ai-gradient-start via-ai-gradient-end to-ai-dark opacity-20"></div>
      
      <header className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center relative z-10">
        <div className="flex items-center gap-2">
          <Brain className="w-8 h-8 text-ai-primary" />
          <h1 className="text-3xl font-bold mb-4 sm:mb-0 bg-clip-text text-transparent bg-gradient-to-r from-ai-primary to-ai-secondary">
            PromptPro AI
          </h1>
        </div>
        <nav className="flex space-x-2">
          {session?.user ? (
            <div className="flex items-center gap-4">
              <span className="text-ai-light">{session.user.email}</span>
              <Button 
                variant="ghost" 
                className="hover:bg-ai-surface text-ai-light"
                onClick={() => signOut()}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <Button 
              className="bg-ai-primary hover:bg-ai-primary/90 text-white shadow-ai-glow"
              onClick={() => signIn()}
            >
              Sign In
            </Button>
          )}
        </nav>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <section className="py-12 sm:py-20 text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-ai-primary to-ai-secondary">
            Elevate Your AI Prompts
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-ai-light">
            Transform your ideas into powerful, AI-ready prompts with our cutting-edge enhancement technology
          </p>
          <div className="max-w-3xl mx-auto">
            <Tabs defaultValue="enhance" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-ai-surface backdrop-blur-ai border border-ai-border rounded-lg">
                <TabsTrigger 
                  value="enhance" 
                  className="data-[state=active]:bg-ai-primary data-[state=active]:text-white text-ai-light"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Enhance
                </TabsTrigger>
                <TabsTrigger 
                  value="history" 
                  className="data-[state=active]:bg-ai-primary data-[state=active]:text-white text-ai-light"
                >
                  <History className="w-4 h-4 mr-2" />
                  History
                </TabsTrigger>
              </TabsList>
              <TabsContent value="enhance">
                <Card className="bg-ai-surface backdrop-blur-ai border-ai-border shadow-ai-neon rounded-lg">
                  <CardContent className="space-y-4 pt-6">
                    <Textarea 
                      placeholder="Enter your prompt here..."
                      className="min-h-[120px] bg-ai-dark/50 border-ai-border text-ai-light placeholder:text-ai-light/50 rounded-md resize-none"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                    {!session?.user && (
                      <p className="text-ai-light text-sm">
                        {3 - anonymousPromptCount} prompts remaining. Sign in for unlimited prompts!
                      </p>
                    )}
                    {error && (
                      <p className="text-ai-error text-sm">{error}</p>
                    )}
                    <Button 
                      size="lg" 
                      className="w-full bg-gradient-to-r from-ai-primary to-ai-secondary hover:opacity-90 shadow-ai-glow rounded-md transition-all duration-200"
                      onClick={enhancePrompt}
                      disabled={isEnhancing || !prompt}
                    >
                      {isEnhancing ? (
                        <>
                          <div className="animate-spin mr-2">
                            <Code className="w-5 h-5" />
                          </div>
                          Enhancing...
                        </>
                      ) : (
                        <>
                          Enhance Prompt
                          <Wand2 className="ml-2 w-5 h-5" />
                        </>
                      )}
                    </Button>
                    {enhancedPrompt && (
                      <div className="mt-6 bg-ai-dark/30 p-4 rounded-md border border-ai-border">
                        <h4 className="text-lg font-semibold mb-2 text-ai-primary">Enhanced Prompt:</h4>
                        <p className="text-ai-light">{enhancedPrompt}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="history">
                <Card className="bg-ai-surface backdrop-blur-ai border-ai-border shadow-ai-neon rounded-lg">
                  <CardContent>
                    {!session?.user ? (
                      <div className="text-center py-8">
                        <Lock className="w-12 h-12 text-ai-light/50 mx-auto mb-4" />
                        <p className="text-ai-light">Sign in to view your prompt history</p>
                      </div>
                    ) : history.length === 0 ? (
                      <p className="text-ai-light text-center py-8">No prompts yet. Start by enhancing your first prompt!</p>
                    ) : (
                      <div className="space-y-4">
                        {history.map((item) => (
                          <div key={item.id} className="border border-ai-border rounded-md p-4 bg-ai-dark/30">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-ai-primary font-semibold">Original Prompt:</h4>
                              <span className="text-ai-light/60 text-sm">
                                {format(new Date(item.createdAt), 'MMM d, yyyy')}
                              </span>
                            </div>
                            <p className="text-ai-light mb-4">{item.originalText}</p>
                            <h4 className="text-ai-secondary font-semibold mb-2">Enhanced Version:</h4>
                            <p className="text-ai-light">{item.enhancedText}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
    </div>
  )
}
