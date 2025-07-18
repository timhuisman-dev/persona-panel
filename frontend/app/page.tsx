"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Settings, Plus, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { startSession, getSession, nextTurn, getSummary, Persona, Session, Message, addMessage } from "@/lib/api"

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

  // Remove persona logic

  const handleNewTopicSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      const sess = await startSession(newTopicForm.title, newTopicForm.description)
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

  const handleSendMessage = async () => {
    if (!session || !inputMessage.trim()) return
    setLoading(true)
    setError(null)
    try {
      const now = new Date().toISOString()
      const message: Message = {
        speaker_id: "user", // generic user
        content: inputMessage,
        timestamp: now,
      }
      const newMsg = await addMessage(session.id, message)
      setSession({ ...session, messages: [...session.messages, newMsg] })
      setInputMessage("")
    } catch (e: any) {
      setError(e.message || 'Failed to send message')
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
        {/* Left Sidebar removed */}
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
              return (
                <div key={index} className={`p-4 rounded-lg ${index % 2 === 0 ? "bg-gray-50" : "bg-blue-50"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{message.speaker_id}</h4>
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
                placeholder="Type your message…"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1"
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                disabled={!session || loading}
              />
              <Button className="flex items-center gap-2" onClick={handleSendMessage} disabled={!session || loading || !inputMessage.trim()}>
                <Send className="w-4 h-4" />
                {loading ? 'Sending...' : 'Send'}
              </Button>
              <Button className="flex items-center gap-2" onClick={handleContinueDiscussion} disabled={!session || loading} variant="secondary">
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
