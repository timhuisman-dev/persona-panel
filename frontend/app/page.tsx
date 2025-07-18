"use client"

import type React from "react"

import { useState } from "react"
import { Settings, Plus, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Mock data for personas with connection status
const personas = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    description: "AI Ethics Researcher",
    avatar: "SC",
    color: "bg-blue-500",
    isActive: false,
    isConnected: true,
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    description: "Product Manager",
    avatar: "MR",
    color: "bg-green-500",
    isActive: true,
    isConnected: true,
  },
  {
    id: 3,
    name: "Elena Kowalski",
    description: "UX Designer",
    avatar: "EK",
    color: "bg-purple-500",
    isActive: false,
    isConnected: true,
  },
  {
    id: 4,
    name: "James Thompson",
    description: "Software Engineer",
    avatar: "JT",
    color: "bg-orange-500",
    isActive: false,
    isConnected: false,
  },
  {
    id: 5,
    name: "Dr. Aisha Patel",
    description: "Data Scientist",
    avatar: "AP",
    color: "bg-pink-500",
    isActive: false,
    isConnected: true,
  },
]

// Mock discussion messages
const messages = [
  {
    id: 1,
    personaId: 1,
    personaName: "Dr. Sarah Chen",
    text: "I think we need to consider the ethical implications of implementing AI-driven decision making in our product. How do we ensure fairness and transparency?",
    timestamp: "2:34 PM",
  },
  {
    id: 2,
    personaId: 2,
    personaName: "Marcus Rodriguez",
    text: "That's a great point, Sarah. From a product perspective, we could implement explainable AI features that show users how decisions are made. This would increase trust and adoption.",
    timestamp: "2:35 PM",
  },
  {
    id: 3,
    personaId: 3,
    personaName: "Elena Kowalski",
    text: "I agree with both of you. From a UX standpoint, we should design clear visual indicators and provide easy-to-understand explanations. Users shouldn't feel like they're dealing with a black box.",
    timestamp: "2:36 PM",
  },
  {
    id: 4,
    personaId: 4,
    personaName: "James Thompson",
    text: "Technically, we can implement audit trails and decision logs. This would help with both transparency and debugging. We'd need to consider the performance impact though.",
    timestamp: "2:37 PM",
  },
  {
    id: 5,
    personaId: 5,
    personaName: "Dr. Aisha Patel",
    text: "The data quality is crucial here. We need robust validation and bias detection in our training datasets. I can work on developing metrics to monitor for algorithmic bias in real-time.",
    timestamp: "2:38 PM",
  },
]

export default function PersonaDiscussionPanel() {
  const [topicTitle, setTopicTitle] = useState("AI Ethics in Product Development")
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [inputMessage, setInputMessage] = useState("")
  const [isNewTopicOpen, setIsNewTopicOpen] = useState(false)
  const [newTopicForm, setNewTopicForm] = useState({
    title: "",
    description: "",
    initialQuestion: "",
  })

  const handleTitleEdit = () => {
    setIsEditingTitle(true)
  }

  const handleTitleSave = () => {
    setIsEditingTitle(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTitleSave()
    }
  }

  const handleNewTopicSubmit = () => {
    // Handle new topic creation logic here
    console.log("New topic:", newTopicForm)
    setTopicTitle(newTopicForm.title)
    setNewTopicForm({ title: "", description: "", initialQuestion: "" })
    setIsNewTopicOpen(false)
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
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="topic-title">Topic Title</Label>
                  <Input
                    id="topic-title"
                    placeholder="Enter discussion topic..."
                    value={newTopicForm.title}
                    onChange={(e) => setNewTopicForm({ ...newTopicForm, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="topic-description">Description</Label>
                  <Textarea
                    id="topic-description"
                    placeholder="Provide context for the discussion..."
                    value={newTopicForm.description}
                    onChange={(e) => setNewTopicForm({ ...newTopicForm, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="initial-question">Initial Question</Label>
                  <Input
                    id="initial-question"
                    placeholder="What should we discuss first?"
                    value={newTopicForm.initialQuestion}
                    onChange={(e) => setNewTopicForm({ ...newTopicForm, initialQuestion: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsNewTopicOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleNewTopicSubmit} disabled={!newTopicForm.title}>
                  Start Discussion
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-20 bg-gray-50 border-r border-gray-200 flex flex-col items-center py-6 gap-4">
          {personas.map((persona) => (
            <div key={persona.id} className="relative group">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-medium cursor-pointer transition-all relative ${
                  persona.color
                } ${persona.isActive ? "ring-2 ring-blue-500 ring-offset-2" : "hover:scale-105"}`}
              >
                {persona.avatar}

                {/* Connection Status Indicator */}
                <div
                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    persona.isConnected ? "bg-green-500" : "bg-gray-400"
                  }`}
                  title={persona.isConnected ? "Connected" : "Disconnected"}
                />
              </div>

              {/* Tooltip */}
              <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-md text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="font-medium">{persona.name}</div>
                <div className="text-gray-300 text-xs">{persona.description}</div>
                <div className="flex items-center gap-1 mt-1">
                  <div className={`w-2 h-2 rounded-full ${persona.isConnected ? "bg-green-400" : "bg-gray-400"}`} />
                  <span className="text-xs text-gray-300">{persona.isConnected ? "Connected" : "Disconnected"}</span>
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
            {isEditingTitle ? (
              <Input
                value={topicTitle}
                onChange={(e) => setTopicTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyPress={handleKeyPress}
                className="text-lg font-medium border-none shadow-none p-0 h-auto focus-visible:ring-0"
                autoFocus
              />
            ) : (
              <h2
                className="text-lg font-medium text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={handleTitleEdit}
              >
                {topicTitle}
              </h2>
            )}
          </div>

          {/* Chat Discussion Area */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {messages.map((message, index) => (
              <div key={message.id} className={`p-4 rounded-lg ${index % 2 === 0 ? "bg-gray-50" : "bg-blue-50"}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{message.personaName}</h4>
                  <span className="text-xs text-gray-500">{message.timestamp}</span>
                </div>
                <p className="text-gray-700 leading-relaxed">{message.text}</p>
              </div>
            ))}
          </div>

          {/* Bottom Input Bar */}
          <div className="px-6 py-4 border-t border-gray-200 bg-white">
            <div className="flex gap-3">
              <Input
                placeholder="Ask the next question…"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1"
              />
              <Button className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Continue Discussion
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
