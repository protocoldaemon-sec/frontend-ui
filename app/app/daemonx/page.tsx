"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useWallet } from "@solana/wallet-adapter-react"
import { Sidebar } from "@/components/daemonx/sidebar"
import { Dashboard } from "@/components/daemonx/dashboard"
import { SecurityAnalysis } from "@/components/daemonx/security-analysis"
import { FlowChart } from "@/components/daemonx/flow-chart"
import { CopilotChat } from "@/components/daemonx/copilot-chat"
import { Settings } from "@/components/daemonx/settings"
import { LoadingScreen } from "@/components/loading-screen"
import { History } from "@/components/daemonx/history"
import { Button } from "@/components/ui/button"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { Lock } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function CopilotPage() {
  const router = useRouter()
  const { publicKey, disconnect } = useWallet()
  const [isLoading, setIsLoading] = useState(true)
  const [activePanel, setActivePanel] = useState("dashboard")
  const [sidebarClosed, setSidebarClosed] = useState(false)
  const isConnected = !!publicKey

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Show wallet connection modal if not connected
  const [showWalletModal, setShowWalletModal] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      setShowWalletModal(!isConnected)
    }
  }, [isLoading, isConnected])

  const renderContent = () => {
    switch (activePanel) {
      case "dashboard":
        return <Dashboard />
      case "analysis":
        return <SecurityAnalysis />
      case "flow":
        return <FlowChart />
      case "copilot":
        return <CopilotChat />
      case "history":
        return <History />
      case "settings":
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  if (isLoading) {
    return <LoadingScreen variant="bars" />
  }

  return (
    <div className="relative flex min-h-screen">
      <Sidebar 
        activePanel={activePanel} 
        setActivePanel={setActivePanel} 
        closed={sidebarClosed} 
        setClosed={setSidebarClosed} 
      />
      
      <main className={`flex-1 transition-all duration-300 ${
        sidebarClosed ? 'md:ml-18' : 'md:ml-64'
      }`}>
        <div className="p-4 md:p-6">
          {renderContent()}
        </div>
      </main>

      <Dialog open={showWalletModal} onOpenChange={setShowWalletModal}>
        <DialogContent className="sm:max-w-md bg-slate-900/95 backdrop-blur-md border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white text-center">Connect Your Wallet</DialogTitle>
            <DialogDescription className="text-gray-400 text-center mt-2">
              You need to connect your wallet to access this page
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <WalletMultiButton className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-medium transition-colors" />
          </div>
        </DialogContent>
      </Dialog>

      {!isConnected ? (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900 p-6 text-center z-50">
          <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 shadow-2xl">
            <div className="flex justify-center mb-6">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/0b774bfeabf0a41dd54fc314dba2e3da7216f89b?width=130"
                alt="Daemon Logo"
                className="w-16 h-16"
              />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Welcome to Daemon</h2>
            <p className="text-gray-400 mb-8">Connect your wallet to access the dashboard and start exploring</p>
            <div className="flex justify-center">
              <WalletMultiButton className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-medium transition-colors" />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
