"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, Bot } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'

interface Message {
  id: string
  text: string
  sender: "user" | "copilot"
  timestamp: Date
  isStreaming?: boolean
  analysisData?: any
  streamingProgress?: number
}

interface SystemPrompts {
  available_prompts: {
    default: string;
    security_analysis: string;
    transaction_analysis: string;
    educational: string;
    compliance: string;
  };
}

interface CopilotChatProps {
  sidebarClosed?: boolean;
}

interface StreamData {
  step?: number;
  status?: string;
  progress?: number;
  data?: any;
  analysis_result?: any;
  detailed_data?: any;
  content?: string;
  delta?: {
    content?: string;
  };
  choices?: Array<{
    delta?: {
      content?: string;
    };
  }>;
}

const BASE_URL = 'https://agent.daemonprotocol.com'

export function CopilotChat({ sidebarClosed = false }: CopilotChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [systemPrompts, setSystemPrompts] = useState<SystemPrompts | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const chatWindowRef = useRef<HTMLDivElement>(null)

  // Check if mobile on mount and on resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }
    
    // Initial check
    checkIfMobile()
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile)
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  useEffect(() => {
    // Load system prompts and add initial welcome message
    const initializeChat = async () => {
      try {
        const response = await fetch(`${BASE_URL}/chat-sentrysol/system-prompts`)
        if (response.ok) {
          const prompts = await response.json()
          setSystemPrompts(prompts)
        }
      } catch (error) {
        console.error('Failed to load system prompts:', error)
      }

      // Add welcome message only once
      setMessages([
        {
          id: "welcome-1",
          text: `# Welcome to Daemon Copilot

How can I assist you with your investigation today? You can ask me things like:

- **Audit this smart contract**: \`0x...\`
- **Give me a summary of this transaction**: \`txhash...\`  
- **Trace the funds from this address**: \`address...\`
- **Analyze security risks for**: \`wallet_address\`

I can perform real-time blockchain analysis and provide detailed security reports!`,
          sender: "copilot",
          timestamp: new Date(),
        },
      ])
    }

    initializeChat()
  }, []) // Remove dependency on messages.length

  // Simple auto-scroll function - always scroll to bottom
  const scrollToBottom = (behavior: 'smooth' | 'instant' = 'smooth') => {
    if (chatWindowRef.current) {
      const element = chatWindowRef.current
      const scrollableElement = element.querySelector('.overflow-y-auto') || element
      
      scrollableElement.scrollTo({
        top: scrollableElement.scrollHeight,
        behavior: behavior
      })
    }
  }

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom('smooth')
  }, [messages])

  // Auto-scroll during typing indicator  
  useEffect(() => {
    if (isTyping) {
      scrollToBottom('smooth')
    }
  }, [isTyping])

  const updateMessageStream = (messageId: string, update: Partial<Message>) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, ...update } : msg
    ))
    
    // Auto-scroll during streaming to keep latest content visible
    setTimeout(() => scrollToBottom('smooth'), 50)
  }

  const detectAddresses = (text: string): string[] => {
    const solanaRegex = /[1-9A-HJ-NP-Za-km-z]{32,44}/g;
    const ethRegex = /0x[a-fA-F0-9]{40}/g;
    
    const addresses = [];
    const solMatches = text.match(solanaRegex) || [];
    const ethMatches = text.match(ethRegex) || [];
    
    addresses.push(...solMatches, ...ethMatches);
    return [...new Set(addresses)];
  }

  const streamChat = async function* (message: string, systemPrompt: string): AsyncGenerator<StreamData> {
    const response = await fetch(`${BASE_URL}/chat-sentrysol-stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        system_prompt: systemPrompt,
        temperature: 0.7,
        max_tokens: 2000
      }),
    });

    if (!response.ok || !response.body) throw new Error('Failed to start chat stream');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;
            
            try {
              yield JSON.parse(data);
            } catch (e) {
              console.warn('Failed to parse streaming data:', data);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  const analyzeAddress = async function* (address: string): AsyncGenerator<StreamData> {
    const response = await fetch(`${BASE_URL}/analyze/${address}`);
    
    if (!response.ok || !response.body) throw new Error('Failed to start address analysis');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;
            
            try {
              yield JSON.parse(data);
            } catch (e) {
              console.warn('Failed to parse analysis data:', data);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  const handleSend = async () => {
    const message = inputValue.trim()
    if (!message || !systemPrompts) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: message,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    
    // Auto-scroll to show the user's new message
    setTimeout(() => scrollToBottom('smooth'), 500)
    
    const addresses = detectAddresses(message)
    
    if (addresses.length === 0) {
      // Regular chat without addresses
      const copilotMessageId = `copilot-${Date.now()}`
      const copilotMessage: Message = {
        id: copilotMessageId,
        text: "",
        sender: "copilot",
        timestamp: new Date(),
        isStreaming: true
      }
      
      setMessages(prev => [...prev, copilotMessage])

      try {
        let fullResponse = ""
        
        for await (const chunk of streamChat(message, systemPrompts.available_prompts.default)) {
          let content = ""
          
          if (typeof chunk === 'string') {
            content = chunk
          } else if (chunk.content) {
            content = chunk.content
          } else if (chunk.delta?.content) {
            content = chunk.delta.content
          } else if (chunk.choices?.[0]?.delta?.content) {
            content = chunk.choices[0].delta.content
          }
          
          if (content) {
            fullResponse += content
            updateMessageStream(copilotMessageId, {
              text: fullResponse,
              isStreaming: true
            })
          }
        }

        updateMessageStream(copilotMessageId, {
          text: fullResponse || "I've received your message. How can I help you with blockchain security analysis?",
          isStreaming: false
        })

      } catch (error) {
        console.error('Streaming error:', error)
        updateMessageStream(copilotMessageId, {
          text: "Sorry, I encountered an error processing your request. Please try again.",
          isStreaming: false
        })
      }
    } else {
      // Handle addresses - go directly to analysis without chat response
      for (const address of addresses) {
        await handleAddressAnalysis(address)
      }
    }
  }

  const handleAddressAnalysis = async (address: string) => {
    const analysisMessageId = `analysis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const analysisMessage: Message = {
      id: analysisMessageId,
      text: `🔍 **Analyzing Address**: \`${address}\`\n\n*Initializing security analysis...*`,
      sender: "copilot",
      timestamp: new Date(),
      isStreaming: true,
      streamingProgress: 0
    }
    
    setMessages(prev => [...prev, analysisMessage])

    try {
      let analysisResult: any = {}
      let currentStep = 1
      let analysisSteps: { [key: number]: { status: string; complete: boolean; data?: any } } = {}
      
      for await (const chunk of analyzeAddress(address)) {
        if (chunk.progress !== undefined) {
          const statusText = chunk.status || 'Processing...'
          
          // Update step status
          if (chunk.step) {
            analysisSteps[chunk.step] = {
              status: statusText,
              complete: false,
              data: chunk.data
            }
            
            // Mark previous steps as complete
            for (let i = 1; i < chunk.step; i++) {
              if (analysisSteps[i]) {
                analysisSteps[i].complete = true
              }
            }
          }
          
          // Build modern progress display
          let progressText = `## 🔍 Security Analysis\n\n`
          progressText += `**Target Address**: \`${address}\`\n\n`
          progressText += `### 📊 Analysis Progress\n\n`
          
          // Progress bar
          const progressPercent = chunk.progress || 0
          const progressBars = Math.floor(progressPercent / 5)
          const progressBar = `${'█'.repeat(progressBars)}${'░'.repeat(20 - progressBars)}`
          progressText += `\`${progressBar}\` **${progressPercent}%**\n\n`
          
          // Analysis steps with modern design
          const stepLabels = {
            1: "📥 Fetching Transaction History",
            2: "🔍 Retrieving Signatures", 
            3: "🪙 Analyzing Token Transfers",
            4: "⚖️ Calculating Risk Score",
            5: "📋 Gathering Additional Data",
            6: "🧮 Aggregating Context",
            7: "🤖 Running AI Analysis",
            8: "📄 Generating Report"
          }
          
          Object.keys(stepLabels).forEach(stepNum => {
            const step = parseInt(stepNum)
            const label = stepLabels[step as keyof typeof stepLabels]
            
            if (analysisSteps[step]) {
              const stepData = analysisSteps[step]
              if (stepData.complete) {
                progressText += `\n✅ **${label}** - Completed\n`
              } else if (step === chunk.step) {
                progressText += `\n🔄 **${label}** - ${stepData.status}\n`
              } else {
                progressText += `\n⏸️ **${label}** - Pending\n`
              }
              
              // Show step data if available
              if (stepData.data) {
                const data = stepData.data
                if (data.transactions_count) {
                  progressText += `   \n• **${data.transactions_count}** transactions found\n`
                }
                if (data.signatures_count) {
                  progressText += `   \n• **${data.signatures_count}** signatures retrieved\n`
                }
                if (data.tokens_analyzed !== undefined) {
                  progressText += `   \n• **${data.tokens_analyzed}** tokens analyzed\n`
                }
                if (data.nfts_found !== undefined) {
                  progressText += `   \n• **${data.nfts_found}** NFTs found\n`
                }
                if (data.balance_changes_count !== undefined) {
                  progressText += `   \n• **${data.balance_changes_count}** balance changes detected\n`
                }
              }
            } else {
              progressText += `\n⏸️ **${label}** - Pending\n`
            }
          })
          
          progressText += `\n---\n\n`
          progressText += `**Current Status**: ${statusText}\n\n`
          progressText += `*Powered by SentrySol Security Engine*`
          
          updateMessageStream(analysisMessageId, {
            text: progressText,
            streamingProgress: chunk.progress,
            isStreaming: true
          })
        }
        
        if (chunk.analysis_result) {
          analysisResult = chunk
          
          // Show completion status
          const completionText = `## ✅ Analysis Complete\n\n**Address**: \`${address}\`\n\n**Status**: Security analysis completed successfully!\n\n*Generating detailed security report...*`
          
          updateMessageStream(analysisMessageId, {
            text: completionText,
            streamingProgress: 100,
            isStreaming: true
          })
          
          // Show final results after brief delay
          setTimeout(() => {
            const markdownAnalysis = convertAnalysisToMarkdown(address, analysisResult)
            
            updateMessageStream(analysisMessageId, {
              text: markdownAnalysis,
              isStreaming: false,
              analysisData: analysisResult
            })
            
            // Force scroll to bottom when analysis completes
            setTimeout(() => scrollToBottom('smooth'), 500)
          }, 800)
          
          break
        }
      }

    } catch (error) {
      console.error('Error analyzing address:', error)
      updateMessageStream(analysisMessageId, {
        text: `## ❌ Analysis Failed\n\n**Address**: \`${address}\`\n\n**Error**: ${error instanceof Error ? error.message : 'Unknown error occurred'}\n\n**Recommendation**: Please verify the address format and try again.\n\n*If the issue persists, the address may not be supported or the service may be temporarily unavailable.*`,
        isStreaming: false
      })
    }
  }

  const convertAnalysisToMarkdown = (address: string, result: any): string => {
    if (!result.analysis_result) {
      return `
<div class="analysis-incomplete">
  <div class="error-icon">❌</div>
  <h2>Analysis Incomplete</h2>
  <div class="address-display">${address}</div>
  <p>Analysis completed but no detailed results available.</p>
</div>`
    }

    const { threat_analysis, detailed_data } = result.analysis_result
    const riskLevel = threat_analysis?.overall_risk_level || 'unknown'
    const riskScore = threat_analysis?.risk_score || 0
    const threats = threat_analysis?.potential_threats || []
    const riskColor = riskLevel === 'high' ? 'high' : riskLevel === 'medium' ? 'medium' : 'low'
    
    let html = `
<div class="security-report">
  <!-- Report Header -->
  <div class="report-header">
    <div class="header-icon">🛡️</div>
    <h1>Security Analysis Report</h1>
    <div class="report-meta">
      <div class="meta-item">
        <span class="meta-label">Address</span>
        <code class="address-code">${address}</code>
      </div>
      <div class="meta-item">
        <span class="meta-label">Chain</span>
        <span class="meta-value">${threat_analysis?.metadata?.chain || 'Unknown'}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Analyzed</span>
        <span class="meta-value">${new Date().toLocaleString()}</span>
      </div>
    </div>
  </div>

  <!-- Risk Assessment Card -->
  <div class="risk-assessment ${riskColor}">
    <div class="risk-header">
      <h2>🎯 Risk Assessment</h2>
      <div class="risk-badge ${riskColor}">${riskLevel.toUpperCase()}</div>
    </div>
    
    <div class="risk-metrics">
      <div class="risk-score-container">
        <div class="risk-score-label">Risk Score</div>
        <div class="risk-score-display">
          <span class="score-number">${riskScore}</span>
          <span class="score-max">/100</span>
        </div>
        <div class="risk-progress">
          <div class="progress-bar">
            <div class="progress-fill ${riskColor}" style="width: ${riskScore}%"></div>
          </div>
        </div>
      </div>
      
      <div class="threat-count">
        <div class="threat-icon">⚠️</div>
        <div class="threat-info">
          <div class="threat-number">${threats.length}</div>
          <div class="threat-label">Threats Found</div>
        </div>
      </div>
    </div>
  </div>`

    // Modern Threat Cards
    if (threats.length > 0) {
      html += `
  <div class="threats-section">
    <h2>🚨 Security Threats Identified</h2>
    <div class="threats-grid">`
    
      threats.forEach((threat: any, idx: number) => {
        const confidenceLevel = threat.confidence || 'medium'
        const evidenceCount = threat.supporting_evidence?.length || 0
        
        html += `
      <div class="threat-card">
        <div class="threat-header">
          <div class="threat-index">${idx + 1}</div>
          <h3 class="threat-title">${threat.threat_type}</h3>
          <div class="confidence-badge ${confidenceLevel}">${confidenceLevel.toUpperCase()}</div>
        </div>
        
        <div class="threat-content">
          <div class="threat-description">${threat.reason}</div>
          
          ${evidenceCount > 0 ? `
          <div class="evidence-section">
            <div class="evidence-icon">📋</div>
            <span class="evidence-text">${evidenceCount} transaction(s) flagged as evidence</span>
          </div>` : ''}
          
          ${threat.recommended_actions && threat.recommended_actions.length > 0 ? `
          <div class="actions-section">
            <h4>🛠️ Recommended Actions</h4>
            <ul class="actions-list">
              ${threat.recommended_actions.map((action: string) => `<li>${action}</li>`).join('')}
            </ul>
          </div>` : ''}
        </div>
      </div>`
      })
      
      html += `
    </div>
  </div>`
    } else {
      html += `
  <div class="no-threats-section">
    <div class="success-icon">✅</div>
    <h2>No Security Threats Detected</h2>
    <p>The analysis found no immediate security concerns with this address.</p>
  </div>`
    }

    // Modern Analytics Cards
    html += `
  <div class="analytics-section">
    <h2>📊 Analysis Overview</h2>
    <div class="analytics-grid">`

    // Transaction Summary Card
    if (detailed_data?.transaction_summary) {
      const summary = detailed_data.transaction_summary
      html += `
      <div class="analytics-card">
        <div class="card-header">
          <div class="card-icon">📈</div>
          <h3>Transaction Activity</h3>
        </div>
        <div class="metrics-list">
          <div class="metric-item">
            <span class="metric-value">${summary.total_transactions || 0}</span>
            <span class="metric-label">Total Transactions</span>
          </div>
          <div class="metric-item">
            <span class="metric-value">${summary.recent_signatures || 0}</span>
            <span class="metric-label">Recent Signatures</span>
          </div>
          <div class="metric-item">
            <span class="metric-value">${summary.balance_changes || 0}</span>
            <span class="metric-label">Balance Changes</span>
          </div>
        </div>
      </div>`
    }

    // Token Holdings Card
    if (detailed_data?.token_analysis) {
      const tokens = detailed_data.token_analysis
      html += `
      <div class="analytics-card">
        <div class="card-header">
          <div class="card-icon">🪙</div>
          <h3>Asset Portfolio</h3>
        </div>
        <div class="metrics-list">
          <div class="metric-item">
            <span class="metric-value">${tokens.tokens_found || 0}</span>
            <span class="metric-label">Tokens</span>
          </div>
          <div class="metric-item">
            <span class="metric-value">${tokens.nfts_found || 0}</span>
            <span class="metric-label">NFTs</span>
          </div>
        </div>
      </div>`
    }

    html += `
    </div>
  </div>`

    // Additional Notes
    if (threat_analysis?.additional_notes) {
      html += `
  <div class="notes-section">
    <div class="notes-header">
      <div class="notes-icon">📝</div>
      <h3>Additional Analysis Notes</h3>
    </div>
    <div class="notes-content">${threat_analysis.additional_notes}</div>
  </div>`
    }

    // Footer
    html += `
  <div class="report-footer">
    <div class="footer-info">
      <div class="engine-info">
        <strong>Analysis Engine:</strong> ${threat_analysis?.engine || 'SentrySol Security Engine'}
      </div>
      <div class="report-id">
        <strong>Report ID:</strong> <code>${threat_analysis?.metadata?.analysis_timestamp || 'N/A'}</code>
      </div>
    </div>
    <div class="disclaimer">
      <em>This report is generated based on publicly available blockchain data and should not be considered as financial advice.</em>
    </div>
  </div>
</div>`
    
    return html
  }

  const getRiskEmojiMarkdown = (level: string): string => {
    switch (level?.toLowerCase()) {
      case 'high': return '🔴'
      case 'medium': return '🟡'
      case 'low': return '🟢'
      default: return '⚪'
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const markdownComponents: Components = {
    // Handle HTML content for modern analysis reports
    div: ({ children, className, ...props }) => {
      if (className?.includes('security-report')) {
        return (
          <div className="modern-security-report" {...props}>
            {children}
          </div>
        )
      }
      return <div className={className} {...props}>{children}</div>
    },
    
    code: ({ children, className, ...props }) => {
      const isInline = !className?.includes('language-')
      
      if (className?.includes('address-code')) {
        return (
          <code className="bg-gradient-to-r from-slate-700/80 to-slate-600/80 text-cyan-300 px-2 py-1 rounded-md text-xs font-mono border border-slate-500/30 shadow-sm">
            {children}
          </code>
        )
      }
      
      if (isInline) {
        return (
          <code
            className="bg-slate-700/50 text-cyan-300 px-1 py-0.5 rounded text-xs font-mono"
            {...props}
          >
            {children}
          </code>
        )
      }
      return (
        <pre className="bg-slate-800/50 border border-slate-600 rounded-md p-2 overflow-x-auto my-2 text-xs">
          <code className="text-slate-200 font-mono" {...props}>
            {children}
          </code>
        </pre>
      )
    },
    p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed text-xs">{children}</p>,
    ul: ({ children }) => (
      <ul className="list-disc list-outside mb-2 space-y-0.5 pl-4 text-xs text-slate-200">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-outside mb-2 space-y-0.5 pl-4 text-xs text-slate-200">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="text-slate-200 leading-relaxed text-xs">{children}</li>,
    strong: ({ children }) => <strong className="font-semibold text-cyan-300 text-xs">{children}</strong>,
    em: ({ children }) => <em className="italic text-slate-300 text-xs">{children}</em>,
    h1: ({ children }) => <h1 className="text-sm font-bold mb-2 text-white border-b border-slate-600 pb-1">{children}</h1>,
    h2: ({ children }) => <h2 className="text-sm font-semibold mb-2 text-white">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xs font-semibold mb-1 text-slate-200">{children}</h3>,
    h4: ({ children }) => <h4 className="text-xs font-semibold mb-1 text-slate-300">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-cyan-400 pl-2 py-1 my-2 bg-slate-800/30 rounded-r text-slate-300 italic text-xs">
        {children}
      </blockquote>
    ),
    a: ({ children, href }) => (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-cyan-400 hover:text-cyan-300 underline decoration-dotted underline-offset-1 transition-colors text-xs"
      >
        {children}
      </a>
    ),
    hr: () => <hr className="border-slate-600 my-2" />,
    table: ({ children }) => (
      <div className="overflow-x-auto my-2">
        <table className="min-w-full border-collapse border border-slate-600 text-xs">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-slate-800">{children}</thead>,
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => <tr className="border-b border-slate-600">{children}</tr>,
    th: ({ children }) => (
      <th className="border border-slate-600 px-2 py-1 text-left font-semibold text-white text-xs">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border border-slate-600 px-2 py-1 text-slate-200 text-xs">
        {children}
      </td>
    )
  }

  return (
    <div className="h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] flex flex-col relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      {/* Main chat container */}
      <div ref={chatWindowRef} className="relative bg-slate-900/60 border border-slate-700/50 rounded-xl shadow-2xl shadow-black/40 backdrop-blur-md flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm border-b border-slate-600/50">
          <h1 className="plus-jakarta text-2xl font-bold text-white px-6 py-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            Daemon Copilot
            <div className="ml-auto">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </h1>
        </div>

        {/* Chat messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 pb-32 bg-gradient-to-b from-transparent to-slate-900/20">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-4 ${
                message.sender === "user" ? "flex-row-reverse" : ""
              }`}
            >
              {/* Avatar */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                message.sender === "user" 
                  ? "bg-gradient-to-br from-cyan-400 to-blue-500" 
                  : "bg-gradient-to-br from-slate-700 to-slate-600"
              }`}>
                {message.sender === "copilot" ? (
                  <Bot className="w-5 h-5 text-white" />
                ) : (
                  <div className="w-5 h-5 bg-white rounded-full"></div>
                )}
              </div>

              {/* Message bubble */}
              <div className={`max-w-[85%] rounded-2xl px-5 py-4 ${
                message.sender === "user"
                  ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
                  : "bg-gradient-to-br from-slate-800 to-slate-700 text-slate-100 shadow-lg shadow-black/25 border border-slate-600/30"
              }`}>
              <div className="max-w-none">
                {message.text.includes('<div class="security-report">') ? (
                  <div 
                    className="modern-analysis-container"
                    dangerouslySetInnerHTML={{ __html: message.text }}
                  />
                ) : (
                  <ReactMarkdown components={markdownComponents}>
                    {message.text}
                  </ReactMarkdown>
                )}
              </div>                {/* Progress bar for streaming */}
                {message.isStreaming && message.streamingProgress !== undefined && (
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs opacity-75">
                      <span>Analyzing...</span>
                      <span>{message.streamingProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-600/50 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-500 ease-out shadow-sm shadow-cyan-400/50" 
                        style={{ width: `${message.streamingProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl px-5 py-4 shadow-lg shadow-black/25 border border-slate-600/30">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "-0.32s" }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "-0.16s" }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input area */}
      <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent backdrop-blur-sm">
        <div 
          className={`w-full mx-auto transition-all duration-300 ${
            isMobile 
              ? 'px-0' // No left padding on mobile since sidebar is hidden
              : sidebarClosed 
                ? 'pl-[4.5rem]' // Match sidebar w-18 (72px)
                : 'pl-64'  // Match sidebar w-64 exactly
          }`}
        >
          <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-600/50 shadow-xl shadow-black/25 p-1 max-w-none">
            <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-transparent px-3 md:px-4 py-2 md:py-3 text-slate-200 focus:outline-none placeholder:text-slate-400 text-sm min-w-0"
                placeholder="Ask Daemon Copilot anything or paste an address to analyze..."
              />
              <button 
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-700 text-white p-2 md:p-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-cyan-500/25 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced styles */}
      <style jsx global>{`
        /* Custom scrollbar */
        div::-webkit-scrollbar {
          width: 6px;
        }
        div::-webkit-scrollbar-track {
          background: rgba(51, 65, 85, 0.3);
          border-radius: 3px;
        }
        div::-webkit-scrollbar-thumb {
          background: rgba(100, 116, 139, 0.5);
          border-radius: 3px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 116, 139, 0.7);
        }

        /* Modern Security Report Styles */
        .security-report {
          max-width: 100%;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #e2e8f0;
          line-height: 1.6;
        }

        /* Report Header */
        .report-header {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          border: 1px solid #475569;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .header-icon {
          font-size: 32px;
          margin-bottom: 12px;
        }

        .report-header h1 {
          font-size: 24px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 16px 0;
        }

        .report-meta {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .meta-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .meta-label {
          font-size: 11px;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .meta-value {
          font-size: 13px;
          color: #e2e8f0;
          font-weight: 500;
        }

        .address-code {
          background: linear-gradient(135deg, #374151 0%, #4b5563 100%);
          color: #22d3ee;
          padding: 6px 12px;
          border-radius: 8px;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          font-size: 12px;
          border: 1px solid #6b7280;
          word-break: break-all;
        }

        /* Risk Assessment */
        .risk-assessment {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
          border-width: 2px;
          border-style: solid;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .risk-assessment.high {
          border-color: #ef4444;
          box-shadow: 0 8px 32px rgba(239, 68, 68, 0.2);
        }

        .risk-assessment.medium {
          border-color: #f59e0b;
          box-shadow: 0 8px 32px rgba(245, 158, 11, 0.2);
        }

        .risk-assessment.low {
          border-color: #10b981;
          box-shadow: 0 8px 32px rgba(16, 185, 129, 0.2);
        }

        .risk-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .risk-header h2 {
          font-size: 20px;
          font-weight: 600;
          color: #ffffff;
          margin: 0;
        }

        .risk-badge {
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .risk-badge.high {
          background: linear-gradient(135deg, #dc2626, #ef4444);
          color: #ffffff;
        }

        .risk-badge.medium {
          background: linear-gradient(135deg, #d97706, #f59e0b);
          color: #ffffff;
        }

        .risk-badge.low {
          background: linear-gradient(135deg, #059669, #10b981);
          color: #ffffff;
        }

        .risk-metrics {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
          align-items: center;
        }

        .risk-score-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .risk-score-label {
          font-size: 12px;
          color: #94a3b8;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .risk-score-display {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .score-number {
          font-size: 36px;
          font-weight: 800;
          color: #ffffff;
        }

        .score-max {
          font-size: 18px;
          color: #94a3b8;
          font-weight: 500;
        }

        .risk-progress {
          width: 100%;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #374151;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 1s ease-in-out;
        }

        .progress-fill.high {
          background: linear-gradient(90deg, #dc2626, #ef4444);
        }

        .progress-fill.medium {
          background: linear-gradient(90deg, #d97706, #f59e0b);
        }

        .progress-fill.low {
          background: linear-gradient(90deg, #059669, #10b981);
        }

        .threat-count {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: rgba(30, 41, 59, 0.5);
          border-radius: 12px;
          border: 1px solid #475569;
        }

        .threat-icon {
          font-size: 24px;
        }

        .threat-number {
          font-size: 28px;
          font-weight: 700;
          color: #ffffff;
        }

        .threat-label {
          font-size: 12px;
          color: #94a3b8;
          text-transform: uppercase;
          font-weight: 600;
        }

        /* Threats Section */
        .threats-section {
          margin-bottom: 24px;
        }

        .threats-section h2 {
          font-size: 20px;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 16px 0;
        }

        .threats-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .threat-card {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          border: 1px solid #ef4444;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(239, 68, 68, 0.1);
        }

        .threat-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          background: rgba(239, 68, 68, 0.1);
          border-bottom: 1px solid rgba(239, 68, 68, 0.2);
        }

        .threat-index {
          background: #ef4444;
          color: #ffffff;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
        }

        .threat-title {
          flex-grow: 1;
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
          margin: 0;
        }

        .confidence-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .confidence-badge.high {
          background: #dc2626;
          color: #ffffff;
        }

        .confidence-badge.medium {
          background: #f59e0b;
          color: #ffffff;
        }

        .confidence-badge.low {
          background: #10b981;
          color: #ffffff;
        }

        .threat-content {
          padding: 20px;
        }

        .threat-description {
          font-size: 14px;
          color: #e2e8f0;
          margin-bottom: 16px;
          line-height: 1.6;
        }

        .evidence-section {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: rgba(30, 41, 59, 0.5);
          border-radius: 8px;
          margin-bottom: 16px;
          border: 1px solid #475569;
        }

        .evidence-icon {
          font-size: 16px;
        }

        .evidence-text {
          font-size: 12px;
          color: #94a3b8;
        }

        .actions-section h4 {
          font-size: 14px;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 12px 0;
        }

        .actions-list {
          margin: 0;
          padding-left: 16px;
          list-style-type: none;
        }

        .actions-list li {
          position: relative;
          font-size: 13px;
          color: #cbd5e1;
          margin-bottom: 8px;
          padding-left: 16px;
        }

        .actions-list li::before {
          content: "→";
          position: absolute;
          left: 0;
          color: #22d3ee;
          font-weight: 600;
        }

        /* No Threats Section */
        .no-threats-section {
          text-align: center;
          padding: 40px;
          background: linear-gradient(135deg, #064e3b 0%, #065f46 100%);
          border: 1px solid #10b981;
          border-radius: 16px;
          margin-bottom: 24px;
        }

        .success-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .no-threats-section h2 {
          font-size: 20px;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 8px 0;
        }

        .no-threats-section p {
          font-size: 14px;
          color: #a7f3d0;
          margin: 0;
        }

        /* Analytics Section */
        .analytics-section {
          margin-bottom: 24px;
        }

        .analytics-section h2 {
          font-size: 20px;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 16px 0;
        }

        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }

        .analytics-card {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          border: 1px solid #475569;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .card-icon {
          font-size: 20px;
        }

        .card-header h3 {
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
          margin: 0;
        }

        .metrics-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .metric-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
        }

        .metric-value {
          font-size: 18px;
          font-weight: 700;
          color: #22d3ee;
        }

        .metric-label {
          font-size: 12px;
          color: #94a3b8;
          font-weight: 500;
        }

        /* Notes Section */
        .notes-section {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          border: 1px solid #475569;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .notes-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .notes-icon {
          font-size: 20px;
        }

        .notes-header h3 {
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
          margin: 0;
        }

        .notes-content {
          font-size: 14px;
          color: #cbd5e1;
          line-height: 1.6;
        }

        /* Report Footer */
        .report-footer {
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid #475569;
          border-radius: 12px;
          padding: 20px;
          margin-top: 24px;
        }

        .footer-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 12px;
          margin-bottom: 16px;
        }

        .footer-info strong {
          color: #22d3ee;
          font-weight: 600;
        }

        .footer-info code {
          background: #374151;
          color: #22d3ee;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 11px;
        }

        .disclaimer {
          font-size: 12px;
          color: #6b7280;
          font-style: italic;
          text-align: center;
          padding-top: 16px;
          border-top: 1px solid #374151;
        }

        /* Analysis Incomplete */
        .analysis-incomplete {
          text-align: center;
          padding: 40px;
          background: linear-gradient(135deg, #7c2d12 0%, #dc2626 100%);
          border: 1px solid #ef4444;
          border-radius: 16px;
        }

        .error-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .analysis-incomplete h2 {
          font-size: 20px;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 12px 0;
        }

        .address-display {
          background: rgba(0, 0, 0, 0.3);
          color: #22d3ee;
          padding: 8px 16px;
          border-radius: 8px;
          font-family: monospace;
          font-size: 12px;
          margin: 16px 0;
          word-break: break-all;
        }

        .analysis-incomplete p {
          font-size: 14px;
          color: #fca5a5;
          margin: 0;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .risk-metrics {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .report-meta {
            grid-template-columns: 1fr;
          }
          
          .analytics-grid {
            grid-template-columns: 1fr;
          }
          
          .footer-info {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}