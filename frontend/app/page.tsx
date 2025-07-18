"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Settings, Plus, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { startSession, getSession, nextTurn, getSummary, Persona, Session, Message } from "@/lib/api"

export default function PersonaDiscussionPanel() {
  const [session, setSession] = useState<Session | null>(null)
  const [inputMessage, setInputMessage] = useState("")
  const [isNewTopicOpen, setIsNewTopicOpen] = useState(false)
  const [newTopicForm, setNewTopicForm] = useState({
    title: "",
    description: "",
    initialQuestion: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Example: Optionally resume session from localStorage (not required for MVP)
  // useEffect(() => {
  //   const sid = localStorage.getItem('sessionId')
  //   if (sid) {
  //     getSession(sid).then(setSession).catch(() => {})
  //   }
  // }, [])

  const handleNewTopicSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      // For MVP, personas are hardcoded; in future, use persona builder
      const personas: Persona[] = [
        {
          id: "1",
          name: "Dr. Sarah Chen",
          description: "AI Ethics Researcher",
          traits: ["ethical", "thoughtful"],
          tone: "formal",
        },
        {
          id: "2",
          name: "Marcus Rodriguez",
          description: "Product Manager",
          traits: ["pragmatic", "goal-oriented"],
          tone: "casual",
        },
        {
          id: "3",
          name: "Elena Kowalski",
          description: "UX Designer",
          traits: ["empathetic", "creative"],
          tone: "friendly",
        },
        {
          id: "4",
          name: "James Thompson",
          description: "Software Engineer",
          traits: ["technical", "precise"],
          tone: "direct",
        },
        {
          id: "5",
          name: "Dr. Aisha Patel",
          description: "Data Scientist",
          traits: ["analytical", "cautious"],
          tone: "measured",
        },
      ]
      const sess = await startSession(newTopicForm.title, personas)
      setSession(sess)
      setIsNewTopicOpen(false)
      setNewTopicForm({ title: "", description: "", initialQuestion: "" })
      // localStorage.setItem('sessionId', sess.id)
    } catch (e: any) {
      setError(e.message || 'Failed to start session')
    } finally {
      setLoading(false)
    }
  }

  const handleContinueDiscussion = async () => {
    if (!session) return
    setLoading(true)
    setError(null)
    try {
      const msg = await nextTurn(session.id)
      setSession({ ...session, messages: [...session.messages, msg], turn_index: session.turn_index + 1 })
    } catch (e: any) {
      setError(e.message || 'Failed to continue discussion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Fixed Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
        <h1 className="text-xl font-semibold text-gray-900">Persona Panel</h1>
        <div className="flex items-center gap-3">
          <Dialog open={isNewTopicOpen} onOpenChange={setIsNewTopicOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Topic Discussion
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Topic Discussion</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Label htmlFor="topic-title">Title</Label>
                <Input id="topic-title" value={newTopicForm.title} onChange={e => setNewTopicForm(f => ({ ...f, title: e.target.value }))} />
                <Label htmlFor="topic-desc">Description</Label>
                <Textarea id="topic-desc" value={newTopicForm.description} onChange={e => setNewTopicForm(f => ({ ...f, description: e.target.value }))} />
                <Label htmlFor="topic-init">Initial Question</Label>
                <Input id="topic-init" value={newTopicForm.initialQuestion} onChange={e => setNewTopicForm(f => ({ ...f, initialQuestion: e.target.value }))} />
                <Button onClick={handleNewTopicSubmit} disabled={loading || !newTopicForm.title} className="w-full">{loading ? 'Starting...' : 'Start Discussion'}</Button>
                {error && <div className="text-red-500 text-sm">{error}</div>}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-20 bg-gray-50 border-r border-gray-200 flex flex-col items-center py-6 gap-4">
          {session?.personas.map((persona, idx) => (
            <div key={persona.id} className="relative group">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-medium cursor-pointer transition-all relative bg-blue-500 hover:scale-105`}
              >
                {persona.name.split(' ').map(n => n[0]).join('')}
                {/* Connection Status Indicator */}
                <div
                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white bg-green-500`}
                  title="Connected"
                />
              </div>
              {/* Tooltip */}
              <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-md text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="font-medium">{persona.name}</div>
                <div className="text-gray-300 text-xs">{persona.description}</div>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-xs text-gray-300">Connected</span>
                </div>
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>
            </div>
          ))}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col">
          {/* Discussion Topic */}
          <div className="px-6 py-4 border-b border-gray-200 bg-white">
            <h2 className="text-lg font-medium text-gray-900">
              {session?.topic || 'No topic selected'}
            </h2>
          </div>

          {/* Chat Discussion Area */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {session?.messages.map((message, index) => {
              const persona = session.personas.find(p => p.id === message.speaker_id)
              return (
                <div key={index} className={`p-4 rounded-lg ${index % 2 === 0 ? "bg-gray-50" : "bg-blue-50"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{persona?.name || message.speaker_id}</h4>
                    <span className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{message.content}</p>
                </div>
              )
            })}
          </div>

          {/* Bottom Input Bar */}
          <div className="px-6 py-4 border-t border-gray-200 bg-white">
            <div className="flex gap-3">
              <Input
                placeholder="Ask the next question… (not yet implemented)"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1"
                disabled
              />
              <Button className="flex items-center gap-2" onClick={handleContinueDiscussion} disabled={!session || loading}>
                <Send className="w-4 h-4" />
                {loading ? 'Thinking...' : 'Continue Discussion'}
              </Button>
            </div>
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          </div>
        </main>
      </div>
    </div>
  )
}
