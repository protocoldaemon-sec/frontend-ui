"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Bot } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "copilot"
  timestamp: Date
}

export function CopilotChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const chatWindowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Add initial welcome message
    if (messages.length === 0) {
      setMessages([
        {
          id: "1",
          text: "Welcome to Daemon Copilot. How can I assist you with your investigation today? You can ask me things like:<br><ul class='list-disc list-inside mt-2'><li>'Audit this smart contract: 0x...'</li><li>'Give me a summary of this transaction...'</li><li>'Trace the funds from this address...'</li></ul>",
          sender: "copilot",
          timestamp: new Date(),
        },
      ])
    }
  }, [messages.length])

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleSend = () => {
    const message = inputValue.trim()
    if (!message) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false)
      const copilotMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm analyzing that now. Please give me a moment.",
        sender: "copilot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, copilotMessage])
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="bg-slate-900/50 border border-slate-700 rounded-lg shadow-lg shadow-black/20 backdrop-blur-sm h-full flex flex-col">
      <h1 className="plus-jakarta text-2xl font-bold text-white p-4 border-b border-slate-700">Daemon Copilot</h1>

      <div ref={chatWindowRef} className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-bubble max-w-[75%] p-3 rounded-lg flex items-start gap-2.5 ${
              message.sender === "user"
                ? "chat-bubble-user bg-cyan-400 text-slate-900 self-end ml-auto"
                : "chat-bubble-copilot bg-slate-800 text-slate-200 self-start"
            }`}
          >
            {message.sender === "copilot" && <Bot className="w-5 h-5 shrink-0 mt-1" />}
            <div dangerouslySetInnerHTML={{ __html: message.text }} className="text-sm" />
          </div>
        ))}

        {isTyping && (
          <div className="chat-bubble max-w-[75%] p-3 rounded-lg flex items-center gap-2.5 bg-slate-800 text-slate-200 self-start">
            <Bot className="w-5 h-5 shrink-0" />
            <div className="typing-indicator flex gap-1">
              <span
                className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                style={{ animationDelay: "-0.32s" }}
              ></span>
              <span
                className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                style={{ animationDelay: "-0.16s" }}
              ></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center bg-slate-800 rounded-lg">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-transparent px-4 py-3 text-slate-200 focus:outline-none placeholder:text-slate-500"
            placeholder="Ask Daemon Copilot..."
          />
          <button onClick={handleSend} className="px-4 text-slate-400 hover:text-cyan-400 transition-colors">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
