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
    <div className="relative">
      <Dialog open={showWalletModal} onOpenChange={setShowWalletModal}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-white">Connect Your Wallet</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300 mt-2">
              You need to connect your wallet to access this page.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <WalletMultiButton className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-medium transition-colors" />
          </div>
        </DialogContent>
      </Dialog>

      {!isConnected ? (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Please connect your wallet to continue</h2>
            <WalletMultiButton className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-medium transition-colors mx-auto" />
          </div>
        </div>
      ) : (
        <div className="w-full flex h-screen">
          <Sidebar
            activePanel={activePanel}
            setActivePanel={setActivePanel}
            closed={sidebarClosed}
            setClosed={setSidebarClosed}
          />
          <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
            <div className="content-panel active">{renderContent()}</div>
          </main>
        </div>
      )}
    </div>
  )
}
